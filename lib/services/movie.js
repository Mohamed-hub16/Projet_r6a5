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

    update(id, movie){
        const { Movie } = this.server.models();
        return Movie.query().findById(id).patch(movie);
    }

    delete(id) {
        const { Movie } = this.server.models();
        return Movie.query().deleteById(id);
    }
}