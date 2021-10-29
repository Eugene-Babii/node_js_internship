/**
 * @type {Knex}
 */

import knex from "knex";

const database = knex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "2homOBC5",
    database: "shop_db",
  },
});

try {
  const selectedRows = await database("customers")
    .where({
      employee_id: 2,
    })
    .select();

  console.log(selectedRows);

  database("customers").where("published_date", "<", 2000).update({
    status: "archived",
    thisKeyIsSkipped: undefined,
  });

  // database("tableName")
  //   .insert([
  //     { email: "john@example.com", name: "John Doe" },
  //     { email: "jane@example.com", name: "Jane Doe" },
  //     { email: "alex@example.com", name: "Alex Doe" },
  //   ])
  //   .onConflict("email")
  //   .merge();

  // Create a table
  // await database.schema.hasTable("users").then(function (exists) {
  //   if (!exists) {
  //     return database.schema.createTable("users", (table) => {
  //       table.increments("id");
  //       table.string("user_name");
  //     });
  //   }
  // });

  // ...and another
  // await database.schema.hasTable("accounts").then(function (exists) {
  //   if (!exists) {
  //     return database.schema.createTable("accounts", (table) => {
  //       table.increments("id");
  //       table.string("account_name");
  //       table.integer("user_id").unsigned().references("users.id");
  //     });
  //   }
  // });

  // Then query the table...
  // let randomName = name.findName();
  // const insertedRows = await database("users").insert({
  //   user_name: randomName,
  // });

  // ...and using the insert id, insert into the other table.
  // let randomAccountName = finance.accountName();
  // await database("accounts").insert({
  //   account_name: randomAccountName,
  //   user_id: insertedRows[0],
  // });

  // Query both of the rows.
  // const selectedRows = await database("users")
  //   .join("accounts", "users.id", "accounts.user_id")
  //   .select("users.user_name as user", "accounts.account_name as account");

  // map over the results
  // const enrichedRows = selectedRows.map((row) => ({ ...row, active: true }));
  // console.error(enrichedRows);

  // Finally, add a catch statement
} catch (e) {
  console.error(e);
}
