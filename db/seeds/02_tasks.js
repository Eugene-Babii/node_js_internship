import faker from "faker";
import { random } from "lodash";
const { internet, lorem, datatype } = faker;

const createFakeTask = () => ({
  title: lorem.words(),
  description: lorem.sentence(),
  is_complete: datatype.boolean(),
});

export function seed(knex) {
  // Deletes ALL existing entries
  return knex("tasks")
    .del()
    .then(async function () {
      // Inserts seed entries
      const fakeTasks = [];
      const tasksCount = 10;
      for (let i = 0; i < tasksCount; i++) {
        fakeTasks.push(createFakeTask());
      }

      await knex("tasks").insert(fakeTasks);
    });
}
