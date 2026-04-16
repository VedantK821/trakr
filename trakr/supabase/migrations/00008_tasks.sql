CREATE TYPE task_priority AS ENUM ('critical', 'high', 'medium', 'low');

-- Sequence table for per-product task numbering
CREATE TABLE product_task_counters (
  product_id uuid PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  last_number integer NOT NULL DEFAULT 0
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  column_id uuid NOT NULL REFERENCES columns(id),
  parent_task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  assignee_id uuid REFERENCES members(id) ON DELETE SET NULL,
  priority task_priority NOT NULL DEFAULT 'medium',
  due_date date,
  position float NOT NULL DEFAULT 0,
  time_estimate integer,
  time_logged integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_org_id ON tasks (org_id);
CREATE INDEX idx_tasks_board_id ON tasks (board_id);
CREATE INDEX idx_tasks_column_id ON tasks (column_id);
CREATE INDEX idx_tasks_assignee_id ON tasks (assignee_id);
CREATE INDEX idx_tasks_parent_task_id ON tasks (parent_task_id);

-- Function to get next task number for a product
CREATE OR REPLACE FUNCTION next_task_number(p_product_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  next_num integer;
BEGIN
  INSERT INTO product_task_counters (product_id, last_number)
  VALUES (p_product_id, 1)
  ON CONFLICT (product_id) DO UPDATE SET last_number = product_task_counters.last_number + 1
  RETURNING last_number INTO next_num;
  RETURN next_num;
END;
$$;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
