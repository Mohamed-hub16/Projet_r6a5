'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { describe, it, beforeEach } = exports.lab = Lab.script();
const { Server } = require('@hapi/hapi');

describe('Movie Service', () => {
    let server;
    let movieService;
    let mockModels;
    let mockServices;

    beforeEach(async () => {
        server = new Server();
        
        mockModels = {
            Movie: {
                query: () => ({
                    insertAndFetch: (movie) => ({ ...movie, id: 1 }),
                    findById: (id) => ({ id, ...mockMovie }),
                    deleteById: (id) => 1,
                    patch: (data) => ({ ...mockMovie, ...data })
                })
            }
        };

        mockServices = {
            mailService: {
                sendNewMovieNotification: () => Promise.resolve()
            },
            brokerService: {
                publishCSVExport: () => Promise.resolve()
            }
        };

        server.decorate('server', 'models', () => mockModels);
        server.decorate('server', 'services', () => mockServices);

        const MovieService = require('../../lib/services/movie');
        movieService = new MovieService(server);
    });

    const mockMovie = {
        id: 1,
        title: 'Test Movie',
        description: 'Test Description',
        filmmaker: 'Test Director',
        releasedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    describe('create()', () => {
        it('creates a new movie and sends notification', async () => {
            const input = {
                title: 'Test Movie',
                description: 'Test Description',
                filmmaker: 'Test Director',
                releasedDate: new Date()
            };

            const result = await movieService.create(input);
            
            expect(result.title).to.equal(input.title);
            expect(result.description).to.equal(input.description);
            expect(result.filmmaker).to.equal(input.filmmaker);
        });
    });

    describe('get()', () => {
        it('retrieves a movie by id', async () => {
            const result = await movieService.get(1);
            expect(result.id).to.equal(1);
        });
    });

    describe('update()', () => {
        it('updates movie properties', async () => {
            const updates = {
                title: 'Updated Title',
                description: 'Updated Description'
            };

            const result = await movieService.update(1, updates);
            expect(result.title).to.equal(updates.title);
            expect(result.description).to.equal(updates.description);
        });
    });

    describe('delete()', () => {
        it('deletes movie by id', async () => {
            const result = await movieService.delete(1);
            expect(result).to.equal(1);
        });
    });

    describe('exportAndSendCSV()', () => {
        it('exports movies to CSV and publishes to broker', async () => {
            const user = { id: 1, mail: 'test@example.com' };
            await movieService.exportAndSendCSV(user);
            // Le test passe si aucune erreur n'est levée
        });
    });
});