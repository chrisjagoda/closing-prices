import knex from "knex";
import path from "path";

const connection = knex({
  client: "sqlite3",
  connection: () => ({
    filename: process.env.NODE_ENV === "test" ? ":memory:" : path.resolve(__dirname, `../../${process.env.SQLITE_FILENAME}`),
  }),
  debug: process.env.NODE_ENV != "production"
});

export default connection;