import knex from "knex";
import path from "path";

export const connection = knex({
  client: 'sqlite3',
  connection: () => ({
    filename: process.env.NODE_ENV === "test" ? ":memory:" : path.resolve(__dirname, process.env.SQLITE_FILENAME)
  })
});
