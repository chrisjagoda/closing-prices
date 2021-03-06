import knex from "knex";

import { databaseConfig } from "../config";

const database = knex(databaseConfig);

export default database;
