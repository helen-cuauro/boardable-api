import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  // Agregar el disparador (trigger) para establecer el board_id
  await params.context.query(`
    CREATE OR REPLACE FUNCTION set_board_id()
    RETURNS TRIGGER AS $$
    DECLARE
      max_board_id INTEGER;
    BEGIN
      SELECT MAX(board_id) INTO max_board_id FROM boards WHERE user_id = NEW.user_id;
      IF max_board_id IS NULL THEN
        max_board_id := 0;
      END IF;
      NEW.board_id := max_board_id + 1;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER set_board_id_trigger
    BEFORE INSERT ON boards
    FOR EACH ROW
    EXECUTE FUNCTION set_board_id();
  `);
};

export const down: Migration = async (params) => {
  await params.context.query(`DROP FUNCTION IF EXISTS set_board_id CASCADE`);
  await params.context.query(`DROP TRIGGER IF EXISTS set_board_id_trigger ON boards`);
};
