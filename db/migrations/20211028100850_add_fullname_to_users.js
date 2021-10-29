export function up(knex) {
  return knex.schema.table("users", function (table) {
    table.string("fullname");
  });
}

export function down(knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("fullname");
  });
}
