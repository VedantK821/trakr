import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.TEST_SUPABASE_URL || "http://127.0.0.1:54321";
const SERVICE_ROLE_KEY =
  process.env.TEST_SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const ANON_KEY =
  process.env.TEST_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

export const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export function createAnonClient() {
  return createClient(SUPABASE_URL, ANON_KEY);
}

export async function createTestUser(email: string, password: string = "testpassword123") {
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: email.split("@")[0] },
  });
  if (error) throw error;
  return data.user;
}

export async function createAuthenticatedClient(email: string, password: string = "testpassword123") {
  const client = createClient(SUPABASE_URL, ANON_KEY);
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

export async function cleanupTestData() {
  await adminClient.from("invites").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await adminClient.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await adminClient.from("members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await adminClient.from("organizations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { data: users } = await adminClient.auth.admin.listUsers();
  for (const user of users?.users || []) {
    await adminClient.auth.admin.deleteUser(user.id);
  }
}
