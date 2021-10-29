import faker from "faker";
const { internet } = faker;

const createFakeUser = () => ({
  email: internet.email(),
  password: internet.password(),
});

export function seed(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(async function () {
      // Inserts seed entries
      const fakeUsers = [];
      const usersCount = 10;
      for (let i = 0; i < usersCount; i++) {
        fakeUsers.push(createFakeUser());
      }

      await knex("users").insert(fakeUsers);
    });
}
