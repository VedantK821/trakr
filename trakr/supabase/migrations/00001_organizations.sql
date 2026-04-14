CREATE TYPE billing_tier AS ENUM ('starter', 'pro', 'business', 'enterprise');

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  billing_tier billing_tier NOT NULL DEFAULT 'starter',
  seat_limit integer NOT NULL DEFAULT 10,
  commit_cap integer NOT NULL DEFAULT 10000,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_organizations_slug ON organizations (slug);
