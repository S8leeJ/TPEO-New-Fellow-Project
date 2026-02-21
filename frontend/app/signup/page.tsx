import Link from "next/link";
import { signup } from "../login/actions";

export default async function SignupPage(props: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 py-2">
      <div className="flex w-full max-w-md flex-col gap-2 rounded-lg border border-zinc-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">Sign Up</h1>
        {searchParams?.message && (
          <p className="mt-4 bg-zinc-100 p-4 text-center text-zinc-700">
            {searchParams.message}
          </p>
        )}
        {searchParams?.error && (
          <p className="mt-4 bg-red-50 p-4 text-center text-red-600">
            {searchParams.error}
          </p>
        )}
        <form className="flex w-full flex-1 flex-col gap-2 text-zinc-900">
          <label className="text-md font-medium text-zinc-700" htmlFor="first_name">
            First Name
          </label>
          <input
            className="mb-6 rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            name="first_name"
            placeholder="John"
            required
          />
          <label className="text-md font-medium text-zinc-700" htmlFor="last_name">
            Last Name
          </label>
          <input
            className="mb-6 rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            name="last_name"
            placeholder="Doe"
            required
          />
          <label className="text-md font-medium text-zinc-700" htmlFor="email">
            Email
          </label>
          <input
            className="mb-6 rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md font-medium text-zinc-700" htmlFor="password">
            Password
          </label>
          <input
            className="mb-6 rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button
            formAction={signup}
            className="mb-2 rounded-md bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
          >
            Sign Up
          </button>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-zinc-900 underline hover:text-zinc-700">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
