import { Database, OPEN_READWRITE, OPEN_CREATE } from "sqlite3";
import path from "path";

export let connection: Database;

export const connect = () => {
  return new Promise((resolve, reject) => {
    const DATABASE_URL = process.env.NODE_ENV === "test" ?
      ":memory:" : path.resolve(__dirname, "../../db/stock_price.db");
    connection = new Database(DATABASE_URL, OPEN_READWRITE | OPEN_CREATE, (err) => {
      if (err) {
        return reject(`Error connecting to stock price database: ${err.message}`);
      }

      console.log("Connected to stock price database.");

      resolve(connection);
    });
  });
};
