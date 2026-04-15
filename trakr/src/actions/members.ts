"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createInviteSchema } from "@/lib/validators/invite";

export async function inviteMember(orgId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: membership } = await supabase
    .from("members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "admin") {
    return { error: "Only admins can invite members" };
  }

  const parsed = createInviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const admin = createAdminClient();

  const { count: memberCount } = await admin
    .from("members")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId);

  const { data: org } = await admin
    .from("organizations")
    .select("seat_limit")
    .eq("id", orgId)
    .single();

  if (org && memberCount !== null && memberCount >= org.seat_limit) {
    return { error: "Organization has reached its seat limit" };
  }

  const { data: existingInvite } = await admin
    .from("invites")
    .select("id")
    .eq("org_id", orgId)
    .eq("email", parsed.data.email)
    .eq("used", false)
    .single();

  if (existingInvite) {
    return { error: "An invite has already been sent to this email" };
  }

  const { data: invite, error } = await admin
    .from("invites")
    .insert({
      org_id: orgId,
      email: parsed.data.email,
      role: parsed.data.role,
    })
    .select("token")
    .single();

  if (error) {
    return { error: "Failed to create invite" };
  }

  return { token: invite.token };
}

export async function removeMember(orgId: string, memberId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: membership } = await supabase
    .from("members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "admin") {
    return { error: "Only admins can remove members" };
  }

  const { data: target } = await supabase
    .from("members")
    .select("user_id")
    .eq("id", memberId)
    .single();

  if (target?.user_id === user.id) {
    return { error: "You cannot remove yourself" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("members").delete().eq("id", memberId);

  if (error) {
    return { error: "Failed to remove member" };
  }

  return { success: true };
}

export async function changeMemberRole(
  orgId: string,
  memberId: string,
  newRole: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: membership } = await supabase
    .from("members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "admin") {
    return { error: "Only admins can change roles" };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("members")
    .update({ role: newRole })
    .eq("id", memberId);

  if (error) {
    return { error: "Failed to update role" };
  }

  return { success: true };
}
