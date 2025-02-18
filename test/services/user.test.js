'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const { describe, it, before } = exports.lab = Lab.script();
const { expect } = Code;
const Server = require('../../server');

describe('UserService', () => {
    let server;
    
    before(async () => {
        server = await Server.deployment();
    });

    describe('create()', () => {
        it('crée un utilisateur avec succès', async () => {
            // Arrange
            const { userService } = server.services();
            const testUser = {
                firstName: 'John',
                lastName: 'Doe',
                mail: 'john.doe@test.com',
                password: 'password123',
                username: 'johndoe'
            };

            // Act
            const result = await userService.create(testUser);

            // Assert
            expect(result).to.exist();
            expect(result.firstName).to.equal(testUser.firstName);
            expect(result.lastName).to.equal(testUser.lastName);
            expect(result.mail).to.equal(testUser.mail);
            expect(result.username).to.equal(testUser.username);
            expect(result.password).to.not.equal(testUser.password); // Le mot de passe doit être hashé
            expect(result.id).to.exist();
            expect(result.createdAt).to.exist();
            expect(result.updatedAt).to.exist();
        });
    });
});