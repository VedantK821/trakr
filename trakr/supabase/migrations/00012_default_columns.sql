-- Creates default kanban columns when a new board is created
CREATE OR REPLACE FUNCTION create_default_columns(p_board_id uuid, p_org_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO columns (board_id, org_id, name, position, is_done) VALUES
    (p_board_id, p_org_id, 'Backlog', 0, false),
    (p_board_id, p_org_id, 'In Progress', 1, false),
    (p_board_id, p_org_id, 'In Review', 2, false),
    (p_board_id, p_org_id, 'Done', 3, true);
END;
$$;
