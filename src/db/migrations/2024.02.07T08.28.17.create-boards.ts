import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  params.context.query(`CREATE TABLE boards (
    board_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    background_color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
};
export const down: Migration = async (params) => {
  params.context.query(`DROP TABLE boards`);
};


