/**
 * @type {Knex}
 */

import faker from "faker";
import moment from "moment";

// import knex from "knex";

// const database = knex({
//   client: "mysql",
//   connection: {
//     host: "127.0.0.1",
//     user: "root",
//     password: "2homOBC5",
//     database: "knex_test",
//   },
// });

import { knex_database } from "./db_connection.js";
const database = knex_database("knex_test");

const { name } = faker;

try {
  // Create a table
  await database.schema.hasTable("test_batch").then(function (exists) {
    if (!exists) {
      return database.schema.createTable("test_batch", (table) => {
        table.increments("id");
        table.string("user_name");
      });
    }
  });

  const ROWS_NUMBER = 1000;

  //single insert 1000 rows
  const singleStart = moment();
  console.log(
    `Single inserting start at ${singleStart.format("HH:mm:ss:SSS")}`
  );
  for (let i = 0; i < ROWS_NUMBER; i++) {
    await database("test_batch").insert({
      user_name: name.findName(),
    });
  }
  const singleEnd = moment();
  const singleDuration = singleEnd.diff(singleStart);
  console.log(`Single inserting ends in ${singleDuration} milliseconds`);

  //batch insert 1000 rows
  const users = [];
  for (let i = 0; i < ROWS_NUMBER; i++) {
    users.push({
      user_name: name.findName(),
    });
  }
  const chunkSize = 5;
  const batchStart = moment();
  console.log(`Batch inserting start at ${batchStart.format("HH:mm:ss:SSS")}`);
  database.batchInsert("test_batch", users, chunkSize).then(function () {
    const batchEnd = moment();
    const batchDuration = batchEnd.diff(batchStart);
    console.log(`Batch inserting ends in ${batchDuration} milliseconds`);
  });
} catch (e) {
  console.error(e);
} finally {
  //   database.destroy();
}
