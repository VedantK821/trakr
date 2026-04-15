import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { acceptInvite } from "@/actions/invite";
import { Button } from "@/components/ui/button";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const admin = createAdminClient();
  const { data: invite } = await admin
    .from("invites")
    .select("id, email, role, used, expires_at, organizations(name)")
    .eq("token", token)
    .single();

  if (!invite || invite.used || new Date(invite.expires_at) < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-deep">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-2xl font-bold">Invalid Invite</h1>
          <p className="text-muted-foreground">This invite link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const orgName = (invite.organizations as unknown as { name: string } | null)?.name || "the organization";

  if (!user) {
    redirect(`/signup?next=/invite/${token}`);
  }

  async function handleAccept() {
    "use server";
    await acceptInvite(token);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-deep">
      <div className="w-full max-w-sm space-y-6 px-4 text-center">
        <h1 className="font-heading text-2xl font-bold">Join {orgName}</h1>
        <p className="text-muted-foreground">
          You&apos;ve been invited as <span className="font-mono text-accent-ai">{invite.role}</span>
        </p>
        <form action={handleAccept}>
          <Button type="submit" className="w-full">Accept Invite</Button>
        </form>
      </div>
    </div>
  );
}
