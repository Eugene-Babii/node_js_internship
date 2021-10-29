export function up(knex, Promise) {
  return knex.schema.table("users", function (table) {
    table.integer("age");
  });
}

export function down(knex, Promise) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("age");
  });
}
