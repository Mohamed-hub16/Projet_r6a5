'use strict';

const Joi = require('joi')

module.exports = [{
    method: 'post',
    path: '/movie',
    options: {
        tags: ['api'],
        auth: {
            scope: ['admin']
        },
        validate: {
          payload: Joi.object({
            title: Joi.string().required().min(2).example('Venom').description('Title of the movie'),
            description: Joi.string().required().min(3).example("It's a film about a symbot that's is crazy").description('Description of the movie'),
            releasedDate: Joi.date().required().example('2022-02-05').description('Released date of the movie'),
            filmmaker: Joi.string().required().min(3).example('Mohamed Mesri').description('Filmmaker of the movie'),
          })
        }
    },
    handler: async (request, h) => {

        const { movieService } = request.services();

        return await movieService.create(request.payload);
    }
  },{
      method: 'get',
      path: '/movies',
      options: {
          tags: ['api'],
          auth: {
              scope: ['user', 'admin']
          }
      },
      handler: async (request, h) => {
          const { Movie } = request.models();
          return Movie.query();
      }
  },{
    method: 'patch',
    path: '/movie/{id}',
    options: {
        tags: ['api'],
        auth: {
            scope: ['admin']
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().greater(0).required()
            }),
            payload: Joi.object({
                title: Joi.string().min(2).example('Venom').description('Title of the movie'),
                description: Joi.string().min(3).example("It's a film about a symbot that's is crazy").description('Description of the movie'),
                releasedDate: Joi.date().example('2022-02-05').description('Released date of the movie'),
                filmmaker: Joi.string().min(3).example('Mohamed Mesri').description('Filmmaker of the movie'),
            })
        }
    },
    handler: async (request, h) => {
        const { movieService } = request.services();
        const result = await movieService.update(request.params.id, request.payload);
        if (result) {
            return result;
        }
        return h.response('not found').code(404);
    }
  },{
      method: 'delete',
      path: '/movie/{id}',
      options: {
          tags: ['api'],
          auth: {
              scope: ['admin']
          },
          validate: {
              params: Joi.object({
                  id: Joi.number().integer().required()
              })
          }
      },
      handler: async (request, h) => {
          const { movieService } = request.services();
          const result = await movieService.delete(request.params.id);
          return result > 0 ? h.response().code(204) : h.response('not found').code(404);
      }
  }
];
