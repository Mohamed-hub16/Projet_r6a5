'use strict';

const { Service } = require('@hapipal/schmervice'); 
const Encrypt = require('@mohamed1687/iut-encrypt');
const Jwt = require('@hapi/jwt');

module.exports = class UserService extends Service {

        create(user){

             const { User } = this.server.models();
             
             //Permet de hash le mot de passe avant de le stocker dans la BDD
             if (user.password) {
                 user.password = Encrypt.sha1(user.password);
             }
        
             return User.query().insertAndFetch(user);
        }
        get(id) {
            const { User } = this.server.models();
            return User.query().findById(id);
        }

        delete(id) {
            const { User } = this.server.models();
            return User.query().deleteById(id);
        }

        verifyPassword(password, hashedPassword) {
            return Encrypt.compareSha1(password, hashedPassword);
        }

        update(id, user){
            const { User } = this.server.models();
            
            // Encrypter le mot de passe s'il est fourni
            if (user.password) {
                user.password = Encrypt.sha1(user.password);
            }

            return User.query().findById(id).patch(user);
        }

        async verifyLogin(mail, password) {
            const { User } = this.server.models();
            const user = await User.query().findOne({ mail });
            
            if (Encrypt.compareSha1(password, user.password)) {
                const token = Jwt.token.generate(
                    {
                        aud: 'urn:audience:iut',
                        iss: 'urn:issuer:iut',
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.mail,
                        scope: user.roles
                    },
                    {
                        key: 'random_string',
                        algorithm: 'HS512'
                    },
                    {
                        ttlSec: 14400
                    }
                );
    
                return token;
            }
    
            return null;
        }

        async updateRoles(id, roles) {
            const { User } = this.server.models();
            return User.query()
                .findById(id)
                .patch({ roles });
        }

}
