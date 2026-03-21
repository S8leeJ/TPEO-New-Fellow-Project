import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ApartmentsListWithSearch from "./ApartmentsListWithSearch";

export default async function DashboardApartmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="-m-6 flex min-h-[calc(100vh-3.5rem-3rem)] flex-1 flex-col bg-zinc-50 p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-primary-900">
          Apartments
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Browse buildings and add units to compare.
        </p>
      </header>
      <ApartmentsListWithSearch />
    </div>
  );
}
