"use strict";

export function up(knex, Promise) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export function down(knex, Promise) {
  return knex.schema.dropTable("users");
}
