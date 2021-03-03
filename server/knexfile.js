const dotenv = require("dotenv");

dotenv.config();

module.exports = {

  test: {
    client: process.env.DATABASE_CLIENT,
    connection: {
      filename: ":memory"
    }
  },

  development: {
    client: process.env.DATABASE_CLIENT,
    connection: {
      filename: process.env.DATABASE_FILENAME
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};
