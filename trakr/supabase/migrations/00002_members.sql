CREATE TYPE member_role AS ENUM ('admin', 'pm', 'dev', 'viewer');

CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'dev',
  display_name text NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE INDEX idx_members_user_id ON members (user_id);
CREATE INDEX idx_members_org_id ON members (org_id);
