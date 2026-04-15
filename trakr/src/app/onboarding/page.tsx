import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateOrgForm } from "@/components/org/create-org-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { redirect("/login"); }

  const { data: memberships } = await supabase
    .from("members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1);

  if (memberships && memberships.length > 0) { redirect("/"); }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-deep">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome to Trakr</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create your organization to get started</p>
        </div>
        <CreateOrgForm />
      </div>
    </div>
  );
}
