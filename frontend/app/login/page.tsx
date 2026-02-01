
import Link from 'next/link'
import { signup } from '../login/actions'

export default async function SignupPage(props: {
    searchParams: Promise<{ message: string; error: string }>
}) {
    const searchParams = await props.searchParams
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                        {searchParams.message}
                    </p>
                )}
                {searchParams?.error && (
                    <p className="mt-4 p-4 bg-red-500/10 text-red-500 text-center">
                        {searchParams.error}
                    </p>
                )}
                <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
                    <label className="text-md" htmlFor="first_name">
                        First Name
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        name="first_name"
                        placeholder="John"
                        required
                    />
                    <label className="text-md" htmlFor="last_name">
                        Last Name
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        name="last_name"
                        placeholder="Doe"
                        required
                    />
                    <label className="text-md" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                    <label className="text-md" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />
                    <button
                        formAction={signup}
                        className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 text-white"
                    >
                        Sign Up
                    </button>
                    <p className="text-sm text-center mt-2">
                        Already have an account?{' '}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
