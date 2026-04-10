import ollama
import random
import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write as write_wav
from faster_whisper import WhisperModel
from kokoro import KPipeline
import tempfile
import threading
import os
import json
import sys
import time

# ── Constants ────────────────────────────────────────────────────────────────
SAMPLE_RATE = 16000
MODEL = "qwen3.5:0.8b"
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "property_details.json")

# Fields to collect, in order: (json_key, hardcoded question)
FIELDS = [
    ("rooms_available",    "How many rooms do you have available for rent?"),
    ("rent_per_month",     "What is the monthly rent?"),
    ("location",           "Where is the property located?"),
    ("amenities",          "What amenities does the property have?"),
    ("lease_start",        "When does the lease start?"),
    ("utilities_included", "Are utilities included in the rent?"),
]

# ── Startup ──────────────────────────────────────────────────────────────────
# Models are cached locally after first download:
#   - Whisper: ~/.cache/huggingface/hub
#   - Kokoro:  ~/.cache/huggingface/hub
#   - Ollama:  managed by Ollama server (~/.ollama/models)

print("Loading Whisper model...")
whisper_model = WhisperModel("tiny", device="cpu", compute_type="int8")
print("Whisper loaded.")

print("Loading Kokoro TTS...")
tts_pipeline = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
print("Kokoro loaded.")

print("Loading Ollama model into memory...")
ollama.chat(
    model=MODEL,
    messages=[{"role": "user", "content": "hello"}],
    keep_alive=-1,
    options={"num_predict": 1},
)
print("Ollama model loaded.\n")


# ── Helpers ──────────────────────────────────────────────────────────────────
def speak(text, voice="af_heart", speed=1.0):
    """Speak text aloud using Kokoro TTS."""
    if not text:
        return
    generator = tts_pipeline(text, voice=voice, speed=speed)
    for _, _, audio in generator:
        sd.play(audio, samplerate=24000)
        sd.wait()


def record_until_enter():
    """Record audio in a background thread until the user presses Enter."""
    frames = []
    stop_event = threading.Event()

    def _record():
        with sd.InputStream(samplerate=SAMPLE_RATE, channels=1, dtype="int16", blocksize=1024) as stream:
            while not stop_event.is_set():
                frame, _ = stream.read(1024)
                frames.append(frame.copy())

    thread = threading.Thread(target=_record)
    thread.start()
    input("Recording... press Enter to stop\n")
    stop_event.set()
    thread.join()

    return np.concatenate(frames, axis=0)


def transcribe(audio):
    """Save audio to a temp .wav, transcribe with faster-whisper, delete the file."""
    stop = spinner("Transcribing")
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        write_wav(tmp.name, SAMPLE_RATE, audio)
        tmp_path = tmp.name
    segments, _ = whisper_model.transcribe(tmp_path, language="en")
    text = " ".join(s.text for s in segments).strip()
    os.remove(tmp_path)
    stop()
    return text


def spinner(message="Thinking"):
    """Show a spinning animation in the terminal. Returns a stop function."""
    frames = ["|", "/", "-", "\\"]
    stop_event = threading.Event()

    def _spin():
        i = 0
        while not stop_event.is_set():
            print(f"\r{frames[i % len(frames)]} {message}...", end="", flush=True)
            i += 1
            time.sleep(0.15)
        print(f"\r{' ' * (len(message) + 6)}", end="\r", flush=True)

    thread = threading.Thread(target=_spin)
    thread.start()
    return lambda: (stop_event.set(), thread.join())


def extract_value(field_name, question, transcription):
    """Use the LLM for one simple job: extract a value from the transcription."""
    stop = spinner("Thinking")
    response = ollama.chat(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a note-taker filling out a form. "
                    "Read what the landlord said and write a short, clean answer for the form field. "
                    "If the landlord did not answer the question or said something unrelated, reply with exactly N/A. "
                    "Reply with ONLY the answer. No explanation. No extra words."
                ),
            },
            # Few-shot examples
            {"role": "user", "content": "Form field: rooms_available\nQuestion asked: How many rooms do you have available for rent?\nLandlord said: \"We got like 3 of the four bedrooms left and a studio\""},
            {"role": "assistant", "content": "3 four-bedrooms, 1 studio"},
            {"role": "user", "content": "Form field: amenities\nQuestion asked: What amenities does the property have?\nLandlord said: \"we've got a pool out back and a gym and there's covered parking too\""},
            {"role": "assistant", "content": "Pool, gym, covered parking"},
            {"role": "user", "content": "Form field: utilities_included\nQuestion asked: Are utilities included in the rent?\nLandlord said: \"yeah water and trash are included but they gotta pay their own electric\""},
            {"role": "assistant", "content": "Water and trash included, electric not included"},
            # Negation example
            {"role": "user", "content": "Form field: utilities_included\nQuestion asked: Are utilities included in the rent?\nLandlord said: \"no we don't cover electric or water but Wi-Fi is free\""},
            {"role": "assistant", "content": "Electric and water not included, Wi-Fi included"},
            # Confirmation example
            {"role": "user", "content": "Form field: utilities_included\nQuestion asked: Are utilities included in the rent?\nLandlord said: \"yes everything is included water electric internet all of it\""},
            {"role": "assistant", "content": "All utilities included (water, electric, internet)"},
            # Irrelevant response example
            {"role": "user", "content": "Form field: rent_per_month\nQuestion asked: What is the monthly rent?\nLandlord said: \"oh yeah the neighborhood is really nice and there's a park nearby\""},
            {"role": "assistant", "content": "N/A"},
            # Actual prompt
            {"role": "user", "content": f"Form field: {field_name}\nQuestion asked: {question}\nLandlord said: \"{transcription}\""},
        ],
        keep_alive=-1,
        think=False,
        options={"num_predict": 32, "temperature": 0.1, "num_ctx": 1024},
    )
    stop()
    value = response["message"]["content"].strip()
    # Strip any think tags just in case
    if "<think>" in value:
        import re
        value = re.sub(r"<think>.*?</think>", "", value, flags=re.DOTALL).strip()
    # Check for N/A (irrelevant response)
    if value and value.upper().strip() == "N/A":
        return None
    return value if value else None


def save_property_details(data):
    """Write property details dict to property_details.json."""
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


# ── Conversation state ───────────────────────────────────────────────────────
property_data = {field: None for field, _ in FIELDS}
save_property_details(property_data)

# ── Greeting ─────────────────────────────────────────────────────────────────
greeting = "Hi there! I'm doing some research on rental listings. I have a few quick questions about this property."
print(f"\nAI: {greeting}\n")
speak(greeting)

# ── Main loop: iterate through each field ────────────────────────────────────
for field_name, question in FIELDS:
    while property_data[field_name] is None:
        # Speak and print the hardcoded question
        print(f"AI: {question}\n")
        speak(question)

        # Wait for user to press Enter (or type "quit")
        user_input = input("Press Enter to start recording (or type 'quit' to exit): ").strip()
        if user_input.lower() == "quit":
            print("Goodbye!")
            exit()

        # Record audio
        audio = record_until_enter()

        # Transcribe
        print("Transcribing...")
        text = transcribe(audio)

        if not text:
            print("(nothing heard, try again)\n")
            continue

        print(f"You said: {text}\n")

        # Extract the value using one simple LLM call
        value = extract_value(field_name, question, text)

        if value:
            property_data[field_name] = value
            save_property_details(property_data)
            print(f"[Saved {field_name}: {value}]\n")
            ack = random.choice([
                "Got it, thanks!",
                "Perfect, noted!",
                "Thanks for that!",
                "Great, moving on!",
                "Awesome, thank you!",
            ])
            print(f"AI: {ack}\n")
            speak(ack)
        else:
            reask = "Sorry, I didn't quite catch the answer to that. Could you please be more specific?"
            print(f"AI: {reask}\n")
            speak(reask)

# ── All fields collected ─────────────────────────────────────────────────────
goodbye = "That's everything I needed. Thank you so much for your time! Goodbye."
print(f"\nAI: {goodbye}\n")
speak(goodbye)