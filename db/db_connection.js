import { createConnection } from "mysql";
import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const client = process.env.DB_CONNECTION;
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

export const connect_db = (db_name) => {
  return createConnection({
    host,
    user,
    password,
    database: db_name,
  });
};

export const knex_database = (db_name) => {
  return knex({
    client,
    connection: {
      host,
      user,
      password,
      database: db_name,
    },
  });
};
