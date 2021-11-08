import { knex_database } from "../db/db_connection.js";
import { Model } from "objection";

const knex = knex_database("users_db");
Model.knex(knex);

// Person model.
class User extends Model {
  static get tableName() {
    return "users";
  }

  //   static get relationMappings() {
  //     return {
  //       children: {
  //         relation: Model.HasManyRelation,
  //         modelClass: User,
  //         join: {
  //           from: "users.id",
  //           to: "persons.parentId",
  //         },
  //       },
  //     };
  //   }
}

async function createSchema() {
  if (await knex.schema.hasTable("users")) {
    return;
  }

  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema.createTable("persons", (table) => {
    table.increments("id").primary();
    table.integer("parentId").references("persons.id");
    table.string("firstName");
  });
}

async function main() {
  // Create some people.
  const sylvester = await Person.query().insertGraph({
    firstName: "Sylvester",

    children: [
      {
        firstName: "Sage",
      },
      {
        firstName: "Sophia",
      },
    ],
  });

  console.log("created:", sylvester);

  // Fetch all people named Sylvester and sort them by id.
  // Load `children` relation eagerly.
  const sylvesters = await Person.query()
    .where("firstName", "Sylvester")
    .withGraphFetched("children")
    .orderBy("id");

  console.log("sylvesters:", sylvesters);
}

createSchema()
  .then(() => main())
  .then(() => knex.destroy())
  .catch((err) => {
    console.error(err);
    return knex.destroy();
  });
