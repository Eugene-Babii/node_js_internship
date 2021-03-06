/**
 * @type {Knex}
 */

import { knex_database } from "./db_connection.js";
import faker from "faker";
const { name, finance } = faker;

const database = knex_database("knex_test");

try {
  // Create a table
  await database.schema.hasTable("users").then(function (exists) {
    if (!exists) {
      return database.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("user_name");
      });
    }
  });

  // ...and another
  await database.schema.hasTable("accounts").then(function (exists) {
    if (!exists) {
      return database.schema.createTable("accounts", (table) => {
        table.increments("id");
        table.string("account_name");
        table.integer("user_id").unsigned().references("users.id");
      });
    }
  });

  // Then query the table...
  let randomName = name.findName();
  const insertedRows = await database("users").insert({
    user_name: randomName,
  });

  // ...and using the insert id, insert into the other table.
  let randomAccountName = finance.accountName();
  await database("accounts").insert({
    account_name: randomAccountName,
    user_id: insertedRows[0],
  });

  // Query both of the rows.
  const selectedRows = await database("users")
    .join("accounts", "users.id", "accounts.user_id")
    .select("users.user_name as user", "accounts.account_name as account");

  // map over the results
  const enrichedRows = selectedRows.map((row) => ({ ...row, active: true }));
  console.error(enrichedRows);

  // Finally, add a catch statement
} catch (e) {
  console.error(e);
}
