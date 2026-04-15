import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("members")
    .select("org_id, role, organizations(name, slug)")
    .eq("user_id", user!.id);

  const org = memberships?.[0]?.organizations as { name: string; slug: string } | null;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">{org?.name || "Dashboard"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Welcome to Trakr. Kanban boards coming in Plan 2.</p>
    </div>
  );
}
