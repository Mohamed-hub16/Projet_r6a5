'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model{
    static get tableName() {

        return 'movie';
    }

    static get joiSchema(){
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(2).example('Venom').description('Title of the movie'),
            description: Joi.string().min(3).example("It's a film about a symbot that's is crazy").description('Description of the movie'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            releasedDate: Joi.date().example('2022-02-05').description('Released date of the movie'),
            filmmaker: Joi.string().min(3).example('Mohamed Mesri').description('Filmmaker of the movie'),
        
        });
    }


    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }
};