'use strict';

const Joi = require('joi')

module.exports = [{
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
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
}

  
  ];