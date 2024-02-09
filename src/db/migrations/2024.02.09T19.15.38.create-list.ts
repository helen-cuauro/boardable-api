import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  params.context.query(`CREATE TABLE lists (
    list_id SERIAL PRIMARY KEY,
    board_id INTEGER REFERENCES boards(board_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
};
export const down: Migration = async (params) => {
  params.context.query(`DROP TABLE lists`);
};



