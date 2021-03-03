import knex from "knex";
import { databaseConfig } from "../config/config";

const connection = knex(databaseConfig);

export default connection;
