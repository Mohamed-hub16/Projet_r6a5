'use strict';

const { Service } = require('@hapipal/schmervice'); 
const Encrypt = require('@mohamed1687/iut-encrypt');

module.exports = class UserService extends Service {

        create(user){

             const { User } = this.server.models();
             
             //Permet de hash le mot de passe avant de le stocker dans la BDD
             if (user.password) {
                 user.password = Encrypt.sha1(user.password);
             }
        
             return User.query().insertAndFetch(user);
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
            return User.query().findById(id).patch(user);
        }
}
