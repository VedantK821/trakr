CREATE OR REPLACE FUNCTION accept_invite(invite_token text, accepting_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inv RECORD;
  new_member_id uuid;
BEGIN
  SELECT * INTO inv
  FROM invites
  WHERE token = invite_token
    AND used = false
    AND expires_at > now()
  FOR UPDATE;

  IF inv IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invite';
  END IF;

  IF EXISTS (
    SELECT 1 FROM members WHERE org_id = inv.org_id AND user_id = accepting_user_id
  ) THEN
    RAISE EXCEPTION 'User is already a member of this organization';
  END IF;

  INSERT INTO members (org_id, user_id, role, display_name)
  VALUES (
    inv.org_id,
    accepting_user_id,
    inv.role,
    (SELECT COALESCE(raw_user_meta_data->>'full_name', email) FROM auth.users WHERE id = accepting_user_id)
  )
  RETURNING id INTO new_member_id;

  UPDATE invites SET used = true WHERE id = inv.id;

  RETURN new_member_id;
END;
$$;
