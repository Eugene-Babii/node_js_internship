/**
 * @type {Knex}
 */

// import knex from "knex";

// const database = knex({
//   client: "mysql",
//   connection: {
//     host: "127.0.0.1",
//     user: "root",
//     password: "2homOBC5",
//     database: "shop_db",
//   },
// });

import { knex_database } from "./db_connection.js";
const database = knex_database("knex_test");

try {
  //   SELECT * FROM employees WHERE employee_id =
  //  (SELECT employee_id FROM customers WHERE name = "Henri Claxson")

  //variant 1
  const subquery = database("customers")
    .where("name", "=", "Henri Claxson")
    .select("employee_id");
  const selectedRows = await database("employees").where(
    "employee_id",
    "=",
    subquery
  );
  console.log("1: ", selectedRows);

  //variant 2
  const selectedRows2 = await database("employees").where(
    "employee_id",
    function () {
      this.select("employee_id")
        .from("customers")
        .where("name", "Henri Claxson");
    }
  );

  console.log("2: ", selectedRows2);

  // Finally, add a catch statement
} catch (e) {
  console.error(e);
}
