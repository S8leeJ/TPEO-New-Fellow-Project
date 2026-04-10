# AI Voice Agent

Calls apartments to find details about availability and pricing.

## Setup

1. Install Ollama and the qwen3.5:0.8b model

2. Install eSpeak NG (for text-to-speech)

3. Install the required packages: pip install -r requirements.txt

## Usage

Run the agent using the following command:

```bash
python agent.py
```

## How it works

The agent uses the following tools to interact with the user:

1. Whisper (for speech-to-text)
2. Qwen3.5:0.8b (for text generation)
3. Kokoro (for text-to-speech)

The agent will ask the user a series of questions about the property and will save the answers to a JSON file.