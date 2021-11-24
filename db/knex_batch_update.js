/**
 * @type {Knex}
 */

import faker from "faker";
import moment from "moment";
import { knex_database } from "./db_connection.js";

const database = knex_database("knex_test");
const { name } = faker;
const users = [];

for (let i = 61; i < 100; i++) {
  users.push({
    id: i,
    user_name: name.findName() + " junior",
  });
}

database.transaction((trx) => {
  const batchStart = moment();
  console.log(`Batch inserting start at ${batchStart.format("HH:mm:ss:SSS")}`);
  const queries = [];
  users.forEach((user) => {
    const query = database("test_batch")
      .where("id", user.id)
      .update({
        user_name: name.findName() + " junior",
      })
      .transacting(trx);
    queries.push(query);
  });

  Promise.all(queries).then(trx.commit).catch(trx.rollback);
  const batchEnd = moment();
  const batchDuration = batchEnd.diff(batchStart);
  console.log(`Batch inserting ends in ${batchDuration} milliseconds`);
  database.destroy();
});
