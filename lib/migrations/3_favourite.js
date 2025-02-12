'use strict';

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable('favourite', (table) => {
            table.increments('id').primary();
            table.integer('userId').unsigned().references('id').inTable('user').onDelete('CASCADE');
            table.integer('movieId').unsigned().references('id').inTable('movie').onDelete('CASCADE');
            table.datetime('createdAt').notNullable();
            table.unique(['userId', 'movieId']);
        });
    },
    down: async (knex) => {
        await knex.schema.dropTableIfExists('favourite');
    }
};