'use strict';

const ContentNegotiator = require('../');

describe('content-negotiator', function () {
    it('is a function', function () {
        expect(ContentNegotiator).toEqual(jasmine.any(Function));
    });

    describe('.mediaRanges', function () {
        it('is an array', function () {
            expect(new ContentNegotiator().mediaRanges).toEqual(jasmine.any(Array));
        });

        it('returns an empty array when not provided an argument', function () {
            expect(new ContentNegotiator().mediaRanges).toEqual([]);
        });

        it('correctly weights example one from rfc7231', function () {
            const acceptHeader = 'audio/*; q=0.2, audio/basic';
            const actual = new ContentNegotiator(acceptHeader).mediaRanges;
            const expected = ['audio/basic', 'audio/*'];

            expect(actual).toEqual(expected);
        });

        it('correctly weights example two from rfc7231', function () {
            const acceptHeader = 'text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c';
            const actual = new ContentNegotiator(acceptHeader).mediaRanges;
            const expected = ['text/html', 'text/x-c', 'text/x-dvi', 'text/plain'];

            expect(actual).toEqual(expected);
        });

        it('correctly weights example three from rfc7231', function () {
            const acceptHeader = 'text/*, text/plain, text/plain;format=flowed, */*';
            const actual = new ContentNegotiator(acceptHeader).mediaRanges;
            const expected = ['text/plain;format=flowed', 'text/plain', 'text/*', '*/*'];

            expect(actual).toEqual(expected);
        });

        it('correctly weights example four from rfc7231', function () {
            const acceptHeader = 'text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5';
            const actual = new ContentNegotiator(acceptHeader).mediaRanges;
            const expected = ['text/html;level=1', 'text/html', '*/*', 'text/html;level=2', 'text/*'];

            expect(actual).toEqual(expected);
        });

        it('rejects an invalid media range value', function () {
            const acceptHeader = '*, text/html';
            const actual = new ContentNegotiator(acceptHeader).mediaRanges;
            const expected = ['text/html'];

            expect(actual).toEqual(expected);
        });
    });

    describe('.prefer', function () {
        it('is a function', function () {
            expect(new ContentNegotiator().prefer).toEqual(jasmine.any(Function));
        });

        it('correctly negotiates example one from rfc7231', function () {
            const acceptHeader = 'audio/*; q=0.2, audio/basic';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefer('audio/basic')).toBe(true);
        });

        it('correctly negotiates example two from rfc7231', function () {
            const acceptHeader = 'text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefer('text/html')).toBe(true);
        });

        it('correctly negotiates example two from rfc7231 with shorthand syntax', function () {
            const acceptHeader = 'text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefer('html')).toBe(true);
        });

        it('correctly negotiates example three from rfc7231', function () {
            const acceptHeader = 'text/*, text/plain, text/plain;format=flowed, */*';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefer('text/plain;format=flowed')).toBe(true); /** @todo Research stringified parameters! */
        });

        it('correctly weights example four from rfc7231', function () {
            const acceptHeader = 'text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefer('text/html;level=1')).toBe(true); /** @todo Research stringified parameters! */
        });

        it('returns a boolean', function () {
            expect(new ContentNegotiator().prefer()).toEqual(jasmine.any(Boolean));
        });
    });
});
