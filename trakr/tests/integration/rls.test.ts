import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  adminClient,
  createTestUser,
  createAuthenticatedClient,
  cleanupTestData,
} from "../setup";

describe("Row-Level Security", () => {
  let userA: { id: string };
  let userB: { id: string };
  let orgA: string;
  let orgB: string;

  beforeAll(async () => {
    await cleanupTestData();

    userA = await createTestUser("alice@test.com");
    userB = await createTestUser("bob@test.com");

    const { data: oA } = await adminClient
      .from("organizations")
      .insert({ name: "Org A", slug: "org-a" })
      .select("id")
      .single();
    orgA = oA!.id;

    const { data: oB } = await adminClient
      .from("organizations")
      .insert({ name: "Org B", slug: "org-b" })
      .select("id")
      .single();
    orgB = oB!.id;

    await adminClient.from("members").insert({
      org_id: orgA, user_id: userA.id, role: "admin", display_name: "Alice",
    });

    await adminClient.from("members").insert({
      org_id: orgB, user_id: userB.id, role: "admin", display_name: "Bob",
    });

    await adminClient.from("products").insert({ org_id: orgA, name: "Product A", prefix: "PA" });
    await adminClient.from("products").insert({ org_id: orgB, name: "Product B", prefix: "PB" });
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("Alice can see Org A but not Org B", async () => {
    const client = await createAuthenticatedClient("alice@test.com");
    const { data: orgs } = await client.from("organizations").select("slug");
    const slugs = orgs?.map((o) => o.slug) || [];
    expect(slugs).toContain("org-a");
    expect(slugs).not.toContain("org-b");
  });

  it("Bob can see Org B but not Org A", async () => {
    const client = await createAuthenticatedClient("bob@test.com");
    const { data: orgs } = await client.from("organizations").select("slug");
    const slugs = orgs?.map((o) => o.slug) || [];
    expect(slugs).toContain("org-b");
    expect(slugs).not.toContain("org-a");
  });

  it("Alice cannot see Bob's members", async () => {
    const client = await createAuthenticatedClient("alice@test.com");
    const { data: members } = await client.from("members").select("display_name, org_id");
    const orgIds = members?.map((m) => m.org_id) || [];
    expect(orgIds).not.toContain(orgB);
  });

  it("Alice cannot see products in Org B", async () => {
    const client = await createAuthenticatedClient("alice@test.com");
    const { data: products } = await client.from("products").select("name, org_id");
    const names = products?.map((p) => p.name) || [];
    expect(names).toContain("Product A");
    expect(names).not.toContain("Product B");
  });

  it("Alice cannot insert a member into Org B", async () => {
    const client = await createAuthenticatedClient("alice@test.com");
    const { error } = await client.from("members").insert({
      org_id: orgB, user_id: userA.id, role: "dev", display_name: "Sneaky Alice",
    });
    expect(error).not.toBeNull();
  });

  it("Alice cannot create a product in Org B", async () => {
    const client = await createAuthenticatedClient("alice@test.com");
    const { error } = await client.from("products").insert({
      org_id: orgB, name: "Sneaky Product", prefix: "SP",
    });
    expect(error).not.toBeNull();
  });
});
