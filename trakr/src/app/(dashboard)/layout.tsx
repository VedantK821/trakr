import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Topnav } from "@/components/layout/topnav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { redirect("/login"); }

  const { data: memberships } = await supabase
    .from("members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1);

  if (!memberships || memberships.length === 0) { redirect("/onboarding"); }

  return (
    <div className="flex h-screen bg-surface-deep">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topnav />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
