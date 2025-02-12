exports.up = function(knex) {
    return knex.schema.createTable('user', (table) => {

        table.increments('id').primary();
        table.string('firstName').notNull();
        table.string('lastName').notNull()

        table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
        table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());

        table.string('password').notNull();
        table.string('mail').notNull();
        table.string('username').notNull();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user');
};
