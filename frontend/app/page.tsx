import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-white dark:text-zinc-900">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between bg-zinc-900 px-4 py-3 md:px-6 dark:bg-zinc-900">
        <span className="text-lg font-bold text-white">WAMP+</span>
        <div className="flex items-center gap-6">
          <span className="hidden text-xs text-zinc-400 sm:inline">
            MADE BY UT STUDENTS FOR UT STUDENTS
          </span>
          <Link
            href="/login"
            className="text-sm font-medium text-white hover:text-zinc-300"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative border-b border-zinc-200 px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            WAMP+
          </h1>
          <Link
            href="/dashboard/compare"
            className="rounded-lg bg-zinc-900 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Compare
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        {/* Section 1: Easiest Way To Compare */}
        <section className="mb-24 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-600">
            EASIEST WAY TO
          </p>
          <h2 className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            COMPARE
          </h2>
          <p className="mt-2 text-xl text-zinc-600">WAMPUS APARTMENTS</p>
        </section>

        {/* Section 2: Unfiltered with Review Cards */}
        <section className="relative mb-24 min-h-[400px] md:min-h-[500px]">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
            {/* Review Cards - Left side, scattered */}
            <div className="relative h-[320px] w-full max-w-md md:h-[400px]">
              {/* Card 1 */}
              <div
                className="absolute left-0 top-0 w-48 rounded-lg bg-white p-4 shadow-lg ring-1 ring-zinc-200"
                style={{ transform: "rotate(-6deg)" }}
              >
                <p className="text-sm font-medium text-zinc-800">
                  Lowkey a scam
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-600">
                    F
                  </div>
                  <div className="text-xs text-zinc-500">
                    <p className="font-medium">Title</p>
                    <p>Description</p>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div
                className="absolute left-8 top-20 w-52 rounded-lg bg-white p-4 shadow-lg ring-1 ring-zinc-200 md:left-16 md:top-24"
                style={{ transform: "rotate(3deg)" }}
              >
                <div className="mb-2 flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm font-medium text-zinc-800">
                  Mold infested
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  I&apos;m going to die in this house
                </p>
              </div>
              {/* Card 3 */}
              <div
                className="absolute bottom-16 left-4 w-44 rounded-lg bg-white p-4 shadow-lg ring-1 ring-zinc-200 md:bottom-20"
                style={{ transform: "rotate(-4deg)" }}
              >
                <p className="text-sm font-medium text-zinc-800">
                  Hidden fees!!
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-600">
                    F
                  </div>
                  <div className="text-xs text-zinc-500">
                    <p className="font-medium">Title</p>
                    <p>Description</p>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div
                className="absolute bottom-0 right-4 w-52 rounded-lg bg-white p-4 shadow-lg ring-1 ring-zinc-200 md:right-8"
                style={{ transform: "rotate(5deg)" }}
              >
                <div className="mb-2 flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm font-medium text-zinc-800">
                  No water for a week
                </p>
                <p className="mt-1 text-xs text-zinc-600">I hate it here</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-600">
                    F
                  </div>
                  <div className="text-xs text-zinc-500">
                    <p>Reviewer name</p>
                    <p>Date</p>
                  </div>
                </div>
              </div>
            </div>
            {/* UNFILTERED - Right side */}
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                UNFILTERED
              </h2>
            </div>
          </div>
        </section>

        {/* Section 3: Accurate & Wampus Only */}
        <section className="text-center">
          <p className="text-lg font-medium text-zinc-600 md:text-xl">
            MOST ACCURATE AND REAL SOURCE OF INFORMATION
          </p>
          <p className="mt-4 text-xl font-medium text-zinc-800 md:text-2xl">
            ALL IN ONE PLACE
          </p>
          <div className="mt-8">
            <h2 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              WAMPUS
            </h2>
            <h2 className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              ONLY
            </h2>
          </div>
        </section>

        {/* CTA at bottom */}
        <div className="mt-24 flex flex-col items-center gap-4 pb-16">
          <Link
            href="/dashboard/compare"
            className="rounded-lg bg-zinc-900 px-12 py-4 text-lg font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Compare Apartments
          </Link>
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-zinc-900 underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
