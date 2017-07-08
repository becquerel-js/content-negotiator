'use strict';

const Accept = require('./Accept');
const AcceptCollection = require('./AcceptCollection');

const max = (a, b) => (a > b) ? a : b;

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = function (acceptHeader = '') {
    const accepts = new AcceptCollection(acceptHeader);
    const qualities = accepts.uniqueSortedQualities;

    const qualityMappedAccepts = qualities.map(quality => {
        const qualityRange = accepts.getValuesByQuality(quality);
        const maxSpecificity = qualityRange.map(accept => accept.specificity).reduce(max, 0);

        let currentSpecificity = maxSpecificity;
        let sorted = [];

        do {
            qualityRange.filter(accept => (accept.specificity === currentSpecificity))
                .forEach(accept => sorted.push(accept));
        } while (--currentSpecificity >= 0);

        return sorted;
    });

    return qualityMappedAccepts.reduce((accumulator, qualityRange) => {
        const mediaRanges = qualityRange.filter(Accept.isNotZeroQuality)
            .map(accept => accept.toString())

        return accumulator.concat(mediaRanges);
    }, []);
};
