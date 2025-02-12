'use strict';

const Joi = require('joi');

module.exports = [{
    method: 'post',
    path: '/favourite/{movieId}',
    options: {
        tags: ['api'],
        auth: {
            scope: ['user', 'admin']
        },
        validate: {
            params: Joi.object({
                movieId: Joi.number().integer().required()
            })
        }
    },
    handler: async (request, h) => {
        const { favouriteService } = request.services();
        const userId = request.auth.credentials.id;
        
        return await favouriteService.addFavourite(userId, request.params.movieId);
    }
}, {
    method: 'delete',
    path: '/favourite/{movieId}',
    options: {
        tags: ['api'],
        auth: {
            scope: ['user', 'admin']
        },
        validate: {
            params: Joi.object({
                movieId: Joi.number().integer().required()
            })
        }
    },
    handler: async (request, h) => {
        const { favouriteService } = request.services();
        const userId = request.auth.credentials.id;

        await favouriteService.removeFavourite(userId, request.params.movieId);
        return h.response().code(204);
    }
}, {
    method: 'get',
    path: '/favourites',
    options: {
        tags: ['api'],
        auth: {
            scope: ['user', 'admin']
        }
    },
    handler: async (request, h) => {
        const { favouriteService } = request.services();
        const userId = request.auth.credentials.id;
        
        return await favouriteService.getUserFavourites(userId);
    }
}];