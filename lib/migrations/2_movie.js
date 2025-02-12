exports.up = function(knex) {
    return knex.schema.createTable('movie', (table) => {

        table.increments('id').primary();
        table.string('title').notNull();
        table.string('description').notNull();
        table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
        table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
        table.dateTime('releasedDate').notNull();
        table.string('filmmaker').notNull();
    });
};
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('movie');
};