// Update with your config settings.

export const development = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "2homOBC5",
    database: "knex_migrate",
  },
  migrations: {
    directory: __dirname + "/db/migrations",
  },
  seeds: {
    directory: __dirname + "/db/seeds",
  },
};
export const staging = {
  client: "postgresql",
  connection: {
    database: "my_db",
    user: "username",
    password: "password",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
export const production = {
  client: "postgresql",
  connection: {
    database: "my_db",
    user: "username",
    password: "password",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
