'use strict';

const Accept = require('./Accept');

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = function (acceptHeader = '') {
    if (typeof acceptHeader !== 'string' || acceptHeader.trim().length === 0) {
        return [];
    }

    let accepts = acceptHeader.split(',')
        .map(accept => accept.trim())
        .filter(Accept.isMediaRange)
        .map(accept => new Accept(accept));

    const qualities = Array.from(
        new Set(accepts.map(accept => accept.quality))
    ).sort((a, b) => b - a);

    return qualities.map(quality => {
        let qualityRange = accepts.filter(accept => (accept.quality === quality))
            .filter(Accept.isNotZeroQuality);

        const specificityApex = qualityRange.reduce((specificityApex, accept) => {
            return (accept.specificity > specificityApex) ? accept.specificity : specificityApex;
        }, 0);

        let specificityRange = specificityApex;
        let sorted = [];

        do {
            qualityRange.filter(accept => (accept.specificity === specificityRange))
                .forEach(accept => sorted.push(accept));
        } while (--specificityRange >= 0);

        return sorted;
    }).filter(quality => quality.length > 0).reduce((accumulator, qualityRange) => {
        return accumulator.concat(qualityRange.map(accept => accept.toString()));
    }, []);
};
