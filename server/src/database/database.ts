import knex from "knex";
import path from "path";

const connection = knex({
  client: "sqlite3",
  connection: () => ({
    filename: process.env.NODE_ENV === "test" ? ":memory:" : path.resolve(__dirname, `../../db/${process.env.SQLITE_FILENAME}`)
  })
});

export default connection;