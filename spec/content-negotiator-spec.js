'use strict';

const ContentNegotiator = require('../');
const MediaType = require('../lib/MediaType');

describe('content-negotiator', function () {
    it('is a function', function () {
        expect(ContentNegotiator).toEqual(jasmine.any(Function));
    });

    describe('.mediaRange', function () {
        it('is an array', function () {
            expect(new ContentNegotiator().mediaRange).toEqual(jasmine.any(Array));
        });

        it('returns an empty array when not provided an argument', function () {
            expect(new ContentNegotiator().mediaRange).toEqual([]);
        });

        it('correctly weights example one from rfc7231', function () {
            const acceptHeader = 'audio/*; q=0.2, audio/basic';
            const actual = new ContentNegotiator(acceptHeader).mediaRange;
            const expected = ['audio/basic', 'audio/*'];

            expect(actual).toEqual(expected);
        });

        it('correctly weights example two from rfc7231', function () {
            const acceptHeader = 'text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c';
            const actual = new ContentNegotiator(acceptHeader).mediaRange;
            const expected = ['text/html', 'text/x-c', 'text/x-dvi', 'text/plain'];

            expect(actual).toEqual(expected);
        });

        it('correctly weights example three from rfc7231', function () {
            const acceptHeader = 'text/*, text/plain, text/plain;format=flowed, */*';
            const actual = new ContentNegotiator(acceptHeader).mediaRange;
            const expected = ['text/plain;format=flowed', 'text/plain', 'text/*', '*/*'];

            expect(actual).toEqual(expected);
        });

        it('correctly weights example four from rfc7231', function () {
            const acceptHeader = 'text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5';
            const actual = new ContentNegotiator(acceptHeader).mediaRange;
            const expected = ['text/html;level=1', 'text/html', '*/*', 'text/html;level=2', 'text/*'];

            expect(actual).toEqual(expected);
        });

        it('rejects an invalid media range value', function () {
            const acceptHeader = '*, text/html';
            const actual = new ContentNegotiator(acceptHeader).mediaRange;
            const expected = ['text/html'];

            expect(actual).toEqual(expected);
        });
    });

    describe('.prefer', function () {
        it('is a function', function () {
            expect(new ContentNegotiator().prefers).toEqual(jasmine.any(Function));
        });

        it('correctly negotiates example one from rfc7231', function () {
            const acceptHeader = 'audio/*; q=0.2, audio/basic';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefers('audio/basic')).toBe(true);
        });

        it('correctly negotiates example two from rfc7231', function () {
            const acceptHeader = 'text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefers('text/html')).toBe(true);
        });

        it('correctly negotiates example two from rfc7231 with shorthand syntax', function () {
            const acceptHeader = 'text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefers('html')).toBe(true);
        });

        it('correctly negotiates example three from rfc7231', function () {
            const acceptHeader = 'text/*, text/plain, text/plain;format=flowed, */*';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefers('text/plain;format=flowed')).toBe(true);
        });

        it('correctly weights example four from rfc7231', function () {
            const acceptHeader = 'text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.prefers('text/html;level=1')).toBe(true);
        });

        it('returns a boolean', function () {
            expect(new ContentNegotiator().prefers()).toEqual(jasmine.any(Boolean));
        });
    });

    describe('.preferred', function () {
        it('is an instance of `MediaType`', function () {
            expect(new ContentNegotiator().preferred).toEqual(jasmine.any(MediaType));
        });

        it('correctly identifies the prefered type of example one from rfc7231', function () {
            const acceptHeader = 'audio/*; q=0.2, audio/basic';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.preferred).toEqual(new MediaType('audio/basic'));
        });

        it('correctly identifies the prefered type of example two from rfc7231', function () {
            const acceptHeader = 'text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.preferred).toEqual(new MediaType('text/html'));
        });

        it('correctly identifies the prefered type of example three from rfc7231', function () {
            const acceptHeader = 'text/*, text/plain, text/plain;format=flowed, */*';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.preferred).toEqual(new MediaType('text/plain;format=flowed'));
        });

        it('correctly identifies the prefered type of example four from rfc7231', function () {
            const acceptHeader = 'text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5';
            const negotiator = new ContentNegotiator(acceptHeader);

            expect(negotiator.preferred).toEqual(new MediaType('text/html;level=1'));
        });
    });
});
