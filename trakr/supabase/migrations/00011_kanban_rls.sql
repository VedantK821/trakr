-- Boards
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org boards"
  ON boards FOR SELECT
  USING (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "Admins and PMs can create boards"
  ON boards FOR INSERT
  WITH CHECK (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

CREATE POLICY "Admins and PMs can update boards"
  ON boards FOR UPDATE
  USING (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

CREATE POLICY "Admins can delete boards"
  ON boards FOR DELETE
  USING (auth.user_role_in_org(org_id) = 'admin');

-- Columns
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org columns"
  ON columns FOR SELECT
  USING (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "Admins and PMs can manage columns"
  ON columns FOR INSERT
  WITH CHECK (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

CREATE POLICY "Admins and PMs can update columns"
  ON columns FOR UPDATE
  USING (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

CREATE POLICY "Admins and PMs can delete columns"
  ON columns FOR DELETE
  USING (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org tasks"
  ON tasks FOR SELECT
  USING (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "Members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.user_role_in_org(org_id) IN ('admin', 'pm', 'dev'));

CREATE POLICY "Members can update tasks"
  ON tasks FOR UPDATE
  USING (auth.user_role_in_org(org_id) IN ('admin', 'pm', 'dev'));

CREATE POLICY "Admins and PMs can delete tasks"
  ON tasks FOR DELETE
  USING (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

-- Product task counters (service role only, no user access needed)
ALTER TABLE product_task_counters ENABLE ROW LEVEL SECURITY;

-- Labels
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org labels"
  ON labels FOR SELECT
  USING (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "Admins and PMs can manage labels"
  ON labels FOR INSERT
  WITH CHECK (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

CREATE POLICY "Admins and PMs can delete labels"
  ON labels FOR DELETE
  USING (auth.user_role_in_org(org_id) IN ('admin', 'pm'));

-- Task Labels
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view task labels"
  ON task_labels FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_labels.task_id
    AND tasks.org_id IN (SELECT auth.user_org_ids())
  ));

CREATE POLICY "Members can manage task labels"
  ON task_labels FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_labels.task_id
    AND auth.user_role_in_org(tasks.org_id) IN ('admin', 'pm', 'dev')
  ));

CREATE POLICY "Members can remove task labels"
  ON task_labels FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM tasks WHERE tasks.id = task_labels.task_id
    AND auth.user_role_in_org(tasks.org_id) IN ('admin', 'pm', 'dev')
  ));

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org comments"
  ON comments FOR SELECT
  USING (org_id IN (SELECT auth.user_org_ids()));

CREATE POLICY "Members can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.user_role_in_org(org_id) IN ('admin', 'pm', 'dev'));

-- Enable realtime for tasks and columns (for live board updates)
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE columns;
