import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("members")
    .select("org_id, role, organizations(name, slug, billing_tier)")
    .eq("user_id", user!.id)
    .single();

  const org = membership?.organizations as { name: string; slug: string; billing_tier: string } | null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your organization</p>
      </div>
      <div className="space-y-4 rounded-lg border border-border-subtle bg-surface-card p-6">
        <h2 className="font-heading text-lg font-semibold">Organization</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Name</p><p className="font-medium">{org?.name}</p></div>
          <div><p className="text-muted-foreground">Slug</p><p className="font-mono text-accent-ai">{org?.slug}</p></div>
          <div><p className="text-muted-foreground">Plan</p><p className="font-mono capitalize">{org?.billing_tier}</p></div>
        </div>
      </div>
    </div>
  );
}
