'use strict';

const Accept = require('./Accept');

const max = (a, b) => (a > b) ? a : b;
const str = (value) => (typeof value === 'string') ? value : ''; /** @todo Change to: `(value && value.toString) ? value.toString() : ''`? */
const trim = (value) => value.trim();

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = function (acceptHeader = '') {
    const accepts = str(acceptHeader).split(',')
        .map(trim)
        .filter(Accept.isMediaRange)
        .map(accept => new Accept(accept));

    const qualities = Array.from(
        new Set(accepts.map(accept => accept.quality))
    ).sort((a, b) => b - a);

    const qualityMappedAccepts = qualities.map(quality => {
        const qualityRange = accepts.filter(accept => (accept.quality === quality))
        const specificityApex = qualityRange.reduce((specificityApex, accept) => {
            return max(accept.specificity, specificityApex);
        }, 0);

        let specificityRange = specificityApex;
        let sorted = [];

        do {
            qualityRange.filter(accept => (accept.specificity === specificityRange))
                .forEach(accept => sorted.push(accept));
        } while (--specificityRange >= 0);

        return sorted;
    })

    return qualityMappedAccepts.reduce((accumulator, qualityRange) => {
        const mediaRanges = qualityRange.filter(Accept.isNotZeroQuality)
            .map(accept => accept.toString())

        return accumulator.concat(mediaRanges);
    }, []);
};
