'use strict';

const { Model } = require('@hapipal/schwifty');
const Joi = require('joi');

module.exports = class Favourite extends Model {

    static get tableName() {
        return 'favourite';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            userId: Joi.number().integer().greater(0).required(),
            movieId: Joi.number().integer().greater(0).required(),
            createdAt: Joi.date()
        });
    }

    static get relationMappings() {
        const Movie = require('./movie');
        const User = require('./user');
        
        return {
            movie: {
                relation: Model.HasOneRelation,
                modelClass: Movie,
                join: {
                    from: 'favourite.movieId',
                    to: 'movie.id'
                }
            },
            user: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'favourite.userId',
                    to: 'user.id'
                }
            }
        };
    }
    
    $beforeInsert(queryContext) {
        this.createdAt = new Date();
    }
};