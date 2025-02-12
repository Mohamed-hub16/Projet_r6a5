'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavouriteService extends Service {
    async addFavourite(userId, movieId) {
        if (!userId || !movieId) {
            throw Boom.badRequest('User ID and Movie ID are required');
        }
        const { Favourite, Movie } = this.server.models();
        
        // Regarde si le film existe
        const movie = await Movie.query().findById(movieId);
        if (!movie) {
            throw Boom.notFound('Movie not found');
        }

        // Vérifie si le film existe déjà
        const exists = await Favourite.query()
            .where({ userId, movieId })
            .first();
            
        if (exists) {
            throw Boom.conflict('Movie already in favourites');
        }

        return Favourite.query().insertAndFetch({
            userId,
            movieId,
            createdAt: new Date()
        });
    }

    async removeFavourite(userId, movieId) {
        const { Favourite } = this.server.models();
        
        const deleted = await Favourite.query()
            .where({ userId, movieId })
            .delete();

        if (!deleted) {
            throw Boom.notFound('Movie not found in favourites');
        }

        return { success: true };
    }

    getUserFavourites(userId) {
        const { Favourite } = this.server.models();
        return Favourite.query()
            .where('userId', userId)
            .joinRelated('movie')
            .select('movie.*', 'favourite.createdAt as addedAt');
    }
}