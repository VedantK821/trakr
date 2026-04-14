-- Helper function: get user's org memberships
CREATE OR REPLACE FUNCTION auth.user_org_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT org_id FROM members WHERE user_id = auth.uid()
$$;

-- Helper function: get user's role in a specific org
CREATE OR REPLACE FUNCTION auth.user_role_in_org(target_org_id uuid)
RETURNS member_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM members WHERE user_id = auth.uid() AND org_id = target_org_id LIMIT 1
$$;

-- Organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their orgs"
  ON organizations FOR SELECT
  USING (id IN (SELECT auth.user_org_ids()));

CREATE POLICY "Admins can update their org"
  ON organizations FOR UPDATE
  USING (auth.user_role_in_org(id) = 'admin')
  WITH CHECK (auth.user_role_in_org(id) = 'admin');

CREATE POLICY "Authenticated users can create orgs"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Members
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org members"
  ON members FOR SELECT
  USING (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "Admins can add members"
  ON members FOR INSERT
  WITH CHECK (auth.user_role_in_org(org_id) = 'admin');

CREATE POLICY "Admins can update members"
  ON members FOR UPDATE
  USING (auth.user_role_in_org(org_id) = 'admin')
  WITH CHECK (auth.user_role_in_org(org_id) = 'admin');

CREATE POLICY "Admins can delete members"
  ON members FOR DELETE
  USING (auth.user_role_in_org(org_id) = 'admin');

-- Invites
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and PMs can view invites"
  ON invites FOR SELECT
  USING (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

CREATE POLICY "Admins can create invites"
  ON invites FOR INSERT
  WITH CHECK (auth.user_role_in_org(org_id) = 'admin');

CREATE POLICY "Admins can delete invites"
  ON invites FOR DELETE
  USING (auth.user_role_in_org(org_id) = 'admin');

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org products"
  ON products FOR SELECT
  USING (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "Admins and PMs can create products"
  ON products FOR INSERT
  WITH CHECK (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

CREATE POLICY "Admins and PMs can update products"
  ON products FOR UPDATE
  USING (auth.user_role_in_org(org_id) IN ('admin', 'pm'))
  WITH CHECK (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (auth.user_role_in_org(org_id) = 'admin');
