"use strict";

import { knex_database } from "../db/db_connection.js";
import { Model } from "objection";

const knex = knex_database("users_db");
Model.knex(knex);

export class User extends Model {
  static get tableName() {
    return "users";
  }
}
