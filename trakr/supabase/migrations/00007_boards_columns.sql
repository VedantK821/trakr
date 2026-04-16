CREATE TYPE board_type AS ENUM ('kanban', 'sprint');

CREATE TABLE boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  type board_type NOT NULL DEFAULT 'kanban',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_boards_org_id ON boards (org_id);
CREATE INDEX idx_boards_product_id ON boards (product_id);

CREATE TABLE columns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  wip_limit integer,
  is_done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_columns_board_id ON columns (board_id);
