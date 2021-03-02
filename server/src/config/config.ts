import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const databaseConfig = {
  client: process.env.DATABASE_CLIENT,
  connection: () => ({
    filename: process.env.NODE_ENV === "test" ? ":memory:" : path.resolve(__dirname, `../../${process.env.DATABASE_FILENAME}`),
  }),
  debug: process.env.NODE_ENV !== "production"
};
