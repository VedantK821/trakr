"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function acceptInvite(token: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const admin = createAdminClient();

  const { data: memberId, error } = await admin.rpc("accept_invite", {
    invite_token: token,
    accepting_user_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}
