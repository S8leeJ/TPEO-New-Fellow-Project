import Link from "next/link";
import { signOut } from "../login/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-lg font-semibold text-zinc-900"
            >
              WAMP+
            </Link>
            <div className="flex gap-4">
              <Link
                href="/dashboard/compare"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                Apartments
              </Link>
              <Link
                href="/dashboard/map"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                Wampus Map
              </Link>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="flex min-h-0 flex-1 flex-col p-6">{children}</main>
    </div>
  );
}
