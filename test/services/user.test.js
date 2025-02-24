'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

// IMPORTANT: Cette ligne est cruciale
exports.lab = Lab.script();
const { describe, it, beforeEach } = exports.lab;
const { Server } = require('@hapi/hapi');
const Encrypt = require('@mohamed1687/iut-encrypt');

describe('User Service', () => {
    let server;
    let userService;
    let mockModels;
    let mockServices;

    beforeEach(async () => {
        server = new Server();
        
        // Mock models
        mockModels = {
            User: {
                query: () => ({
                    insertAndFetch: (user) => ({ ...user, id: 1 }),
                    findById: (id) => ({ id, ...mockUser }),
                    deleteById: (id) => 1,
                    findOne: (criteria) => mockUser,
                    patch: (data) => ({ ...mockUser, ...data })
                })
            }
        };

        // Mock mail service
        mockServices = {
            mailService: {
                sendWelcomeEmail: () => Promise.resolve()
            }
        };

        // Mock server methods
        server.decorate('server', 'models', () => mockModels);
        server.decorate('server', 'services', () => mockServices);

        const UserService = require('../../lib/services/user'); // Corrigé de lib/services/user
        userService = new UserService(server);
    });

    const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        mail: 'john@example.com',
        password: Encrypt.sha1('password123'),
        roles: ['user']
    };

    describe('create()', () => {
        it('creates a new user with hashed password', async () => {
            const input = {
                firstName: 'John',
                lastName: 'Doe',
                mail: 'john@example.com',
                password: 'password123'
            };

            const result = await userService.create(input);

            expect(result.firstName).to.equal(input.firstName);
            expect(result.password).to.not.equal(input.password);
        });
    });

    describe('verifyPassword()', () => {
        it('returns true for matching passwords', () => {
            const plainPassword = 'password123';
            const hashedPassword = Encrypt.sha1(plainPassword);

            const result = userService.verifyPassword(plainPassword, hashedPassword);
            expect(result).to.be.true();
        });

        it('returns false for non-matching passwords', () => {
            const plainPassword = 'password123';
            const wrongPassword = 'wrongpassword';
            const hashedPassword = Encrypt.sha1(plainPassword);

            const result = userService.verifyPassword(wrongPassword, hashedPassword);
            expect(result).to.be.false();
        });
    });

    describe('verifyLogin()', () => {
        it('returns token for valid credentials', async () => {
            const result = await userService.verifyLogin('john@example.com', 'password123');
            expect(result).to.be.string();
            expect(result).to.not.be.empty();
        });

        it('returns null for invalid credentials', async () => {
            const result = await userService.verifyLogin('john@example.com', 'wrongpassword');
            expect(result).to.be.null();
        });
    });

    describe('update()', () => {
        it('updates user properties', async () => {
            const updates = {
                firstName: 'Jane',
                lastName: 'Smith'
            };

            const result = await userService.update(1, updates);
            expect(result.firstName).to.equal(updates.firstName);
            expect(result.lastName).to.equal(updates.lastName);
        });

        it('hashes password when included in update', async () => {
            const updates = {
                password: 'newpassword123'
            };

            const result = await userService.update(1, updates);
            expect(result.password).to.not.equal(updates.password);
        });
    });

    describe('delete()', () => {
        it('deletes user by id', async () => {
            const result = await userService.delete(1);
            expect(result).to.equal(1);
        });
    });
});