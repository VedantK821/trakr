"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOrgSchema } from "@/lib/validators/org";

export async function createOrg(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const parsed = createOrgSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const admin = createAdminClient();

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: parsed.data.name, slug: parsed.data.slug })
    .select("id")
    .single();

  if (orgError) {
    if (orgError.code === "23505") {
      return { error: "That slug is already taken" };
    }
    return { error: "Failed to create organization" };
  }

  const { error: memberError } = await admin.from("members").insert({
    org_id: org.id,
    user_id: user.id,
    role: "admin",
    display_name: user.user_metadata?.full_name || user.email || "Admin",
  });

  if (memberError) {
    await admin.from("organizations").delete().eq("id", org.id);
    return { error: "Failed to add you as a member" };
  }

  redirect("/");
}
