'use strict';

const Joi = require('joi')

module.exports = [{
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        auth: false,
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
            password: Joi.string().required().min(8).example('root1234').description('Password of the user'),
            mail: Joi.string().required().min(8).email().example('john@doe.com').description('Email of the user'),
            username: Joi.string().required().example('john').description('Username of the user')
          })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.create(request.payload);
    }
  },
  {
    method: 'get',
    path: '/users',
    options: {
        tags: ['api'],
        auth: {
            scope: ['user', 'admin']
        },
    },
    handler: async (request, h) => {
    
        const { User } = request.models();
        return await User.query();
    }
  },{
    method: 'delete',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        auth: {
            scope: ['admin']
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().greater(0).required()
            })
        }
    },
    handler: async (request, h) => {
        const { userService } = request.services();
        const result = await userService.delete(request.params.id);
        
        if (result > 0) {
            return '';
        } else {
            return 'not found';
        }
    }
    },{
        method: 'patch',
        path: '/user/{id}',
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
                    firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                    mail: Joi.string().email().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().example('password').description('Password of the user'),
                    username: Joi.string().example('johndoe').description('Username of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const result = await userService.update(request.params.id, request.payload);
            if (result) {
                return result;
            }
            return h.response('not found').code(404);
        }
    },{
        method: 'post',
        path: '/user/login',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    mail: Joi.string().email().required().example('john@doe.fr').description('Email of the user'),
                    password: Joi.string().required().example('password').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const token = await userService.verifyLogin(request.payload.mail, request.payload.password);
            
            if (!token) {
                return h.response().code(401);
            }
            
            return { token };
        }
    },{
        method: 'get',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const result = await userService.get(request.params.id);
            return result || h.response('not found').code(404);
        }
    },{
        method: 'patch',
        path: '/user/{id}/roles',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                payload: Joi.object({
                    roles: Joi.array().items(Joi.string()).required()
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const result = await userService.update(request.params.id, { roles: request.payload.roles });
            return result || h.response('not found').code(404);
        }
    }
];