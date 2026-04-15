import { createClient } from "@/lib/supabase/server";
import { MemberList } from "@/components/members/member-list";
import { InviteForm } from "@/components/members/invite-form";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("members")
    .select("org_id, role")
    .eq("user_id", user!.id)
    .single();

  if (!membership) { return <p>No organization found.</p>; }

  const { data: members } = await supabase
    .from("members")
    .select("id, display_name, role, user_id")
    .eq("org_id", membership.org_id)
    .order("joined_at", { ascending: true });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Members</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage team members and invitations</p>
      </div>
      {membership.role === "admin" && (
        <div className="space-y-4 rounded-lg border border-border-subtle bg-surface-card p-6">
          <h2 className="font-heading text-lg font-semibold">Invite Member</h2>
          <InviteForm orgId={membership.org_id} />
        </div>
      )}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold">Team ({members?.length || 0})</h2>
        <MemberList members={members || []} orgId={membership.org_id} currentUserId={user!.id} currentUserRole={membership.role} />
      </div>
    </div>
  );
}
