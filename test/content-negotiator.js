'use strict';

const expect = require('chai').expect;
const contentNegotiator = require('../');

describe('content-negotiator', function () {
    it('is a function', function () {
        expect(contentNegotiator).to.be.a('function');
    });
});
