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

    it('correctly weights example one from rfc7231', function () {
        const actual = contentNegotiator('audio/*; q=0.2, audio/basic');
        const expected = ['audio/basic', 'audio/*'];

        expect(actual).toEqual(expected);
    });

    it('correctly weights example two from rfc7231', function () {
        const actual = contentNegotiator('text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c');
        const expected = ['text/html', 'text/x-c', 'text/x-dvi', 'text/plain'];

        expect(actual).toEqual(expected);
    });

    it('correctly weights example three from rfc7231', function () {
        const actual = contentNegotiator('text/*, text/plain, text/plain;format=flowed, */*');
        const expected = ['text/plain;format=flowed', 'text/plain', 'text/*', '*/*'];

        expect(actual).toEqual(expected);
    });

    it('correctly weights example four from rfc7231', function () {
        const actual = contentNegotiator('text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5');
        const expected = ['text/html;level=1', 'text/html', '*/*', 'text/html;level=2', 'text/*'];

        expect(actual).toEqual(expected);
    });

    it('rejects an invalid media range value', function () {
        expect(contentNegotiator('*, text/html')).toEqual(['text/html']);
    });
});
