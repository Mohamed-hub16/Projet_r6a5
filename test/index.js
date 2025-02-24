'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

// IMPORTANT: Cette ligne est cruciale
exports.lab = Lab.script();
const { describe, it } = exports.lab;

describe('Main', () => {
    it('should run tests', () => {
        expect(true).to.be.true();
    });
});