'use strict';

const range = require('../lib/range');

describe('range', function () {
    it('is a function', function () {
        expect(range).toEqual(jasmine.any(Function));
    });

    it('returns an array', function () {
        expect(range(1)).toEqual(jasmine.any(Array));
    });

    describe('when provided only a single argument', function () {
        it('returns the appropriate range of numbers when passed 2', function () {
            expect(range(2)).toEqual([0, 1]);
        });

        it('returns the appropriate range of numbers when passed 5', function () {
            expect(range(5)).toEqual([0, 1, 2, 3, 4]);
        });
    });

    describe('when provided both a start and end argument', function () {
        it('returns the appropriate range of numbers when passed 2, 5', function () {
            expect(range(2, 5)).toEqual([2, 3, 4]);
        });

        it('returns the appropriate range of numbers when passed 0, 3', function () {
            expect(range(0, 3)).toEqual([0, 1, 2]);
        });
    });
});
