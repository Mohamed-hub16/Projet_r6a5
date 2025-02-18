'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class MovieService extends Service{
    async create(movie) {
        const { Movie } = this.server.models();
        const { mailService } = this.server.services();
        
        const newMovie = await Movie.query().insertAndFetch(movie);
        
        // Récupérer tous les utilisateurs pour leur envoyer une notification
        const { User } = this.server.models();
        const users = await User.query();
        
        // Envoyer les notifications
        await mailService.sendNewMovieNotification(users, newMovie);
        
        return newMovie;
    }

    get(id) {
        const { Movie } = this.server.models();
        return Movie.query().findById(id);
    }

    async update(id, movie) {
        const { Movie, Favourite } = this.server.models();
        const { mailService } = this.server.services();
    
        // Mettre à jour le film
        await Movie.query().findById(id).patch(movie);
        
        // Récupérer le film mis à jour avec toutes les informations
        const updatedMovie = await Movie.query().findById(id);
        
        // Récupérer tous les utilisateurs qui ont ce film en favori
        const favourites = await Favourite.query()
            .where('movieId', id)
            .joinRelated('user')
            .select('user.*');
        
        // Si des utilisateurs ont ce film en favori, leur envoyer une notification
        if (favourites.length > 0) {
            await mailService.sendMovieUpdateNotification(favourites, updatedMovie);
        }
        
        return updatedMovie;
    }

    delete(id) {
        const { Movie } = this.server.models();
        return Movie.query().deleteById(id);
    }

    async exportAndSendCSV(user) {
        const { Movie } = this.server.models();
        const { brokerService } = this.server.services();
        
        // Récupérer tous les films
        const movies = await Movie.query();
        
        // Convertir en CSV
        const headers = ['id', 'title', 'description', 'filmmaker', 'releasedDate', 'createdAt', 'updatedAt'];
        const csvContent = [
            headers.join(','),
            ...movies.map(movie => {
                return headers.map(header => {
                    const value = movie[header];
                    return value instanceof Date ? value.toISOString() : value;
                }).join(',');
            })
        ].join('\n');
        
        // Créer un buffer à partir du contenu CSV
        const csvBuffer = Buffer.from(csvContent, 'utf-8');
        
        // Envoyer au broker
        await brokerService.publishCSVExport(user.id, csvBuffer);
    }
}