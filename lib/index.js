'use strict';

const Accept = require('./Accept');
const AcceptCollection = require('./AcceptCollection');

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = function (acceptHeader = '') {
    const accepts = new AcceptCollection(acceptHeader);
    const qualities = accepts.uniqueSortedQualities;

    const qualityMappedAccepts = qualities.map(quality => {
        const acceptsByQuality = accepts.filterByQuality(quality);

        let currentSpecificity = acceptsByQuality.maxSpecificity;
        let sorted = [];

        do {
            acceptsByQuality.filterBySpecificity(currentSpecificity).values
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
