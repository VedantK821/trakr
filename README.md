# trakr

A multi-tenant SaaS project tracker where **Claude keeps your kanban board in sync with your git history** — tasks move themselves as you push commits.

## What it does
- **Multi-tenant workspaces** — organizations, members, and role-based access, with Postgres **row-level security** on every table (cross-tenant isolation is tested, not assumed).
- **Auth & onboarding** — sign-up, organization creation, and member invites out of the box.
- **AI kanban pipeline** *(in progress)* — reads git pushes via webhooks + Claude Code hooks and auto-updates task status, exposed through an **MCP server** and a CLI.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Supabase (Postgres + Auth + RLS) · Zod · Tailwind v4 + shadcn/ui · Vitest. Server-Actions architecture.

## Status
Foundation shipped: 12 RLS-secured migrations, full auth / org / role-invite flows, and cross-tenant isolation tests. The git → kanban AI pipeline is designed and in active build.

## Local development
1. `npm install`
2. Copy `.env.local.example` → `.env.local` and fill in your Supabase keys.
3. Start a local Supabase stack and apply the migrations in `supabase/migrations`.
4. `npm run dev`
