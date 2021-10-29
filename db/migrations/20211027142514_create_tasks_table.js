export function up(knex, Promise) {
  return knex.schema.createTable("tasks", function (table) {
    table.increments("id");
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.boolean("is_complete").notNullable().defaultTo(false);
    table.integer("user_id").unsigned().references("users.id");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex, Promise) {
  return knex.schema.dropTable("tasks");
}
