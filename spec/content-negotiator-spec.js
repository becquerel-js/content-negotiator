'use strict';

const contentNegotiator = require('../');

describe('content-negotiator', function () {
    it('is a function', function () {
        expect(contentNegotiator).toEqual(jasmine.any(Function));
    });

    it('returns an array', function () {
        expect(contentNegotiator()).toEqual(jasmine.any(Array));
    });

    it('returns an empty array when not provided an argument', function () {
        expect(contentNegotiator()).toEqual([]);
    });
});
