'use strict';

exports.up = function(knex) {
    return knex.schema.alterTable('user', function(table) {
        table.string('roles').notNullable().defaultTo('user');
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('user', function(table) {
        table.dropColumn('roles');
    });
};