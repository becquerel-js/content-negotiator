'use strict';

const AcceptArray = require('./AcceptArray');

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = function (acceptHeader = '') {
    const accepts = new AcceptArray(acceptHeader);
    const qualityMappedAccepts = accepts.uniqueSortedQualities.reduce((map, quality) => {
        return map.set(quality, accepts.quality(quality).sortBySpecificity());
    }, new Map());

    qualityMappedAccepts.delete(0);

    return Array.from(qualityMappedAccepts.values()).reduce((accumulator, acceptQualityRange) => {
        return accumulator.concat(
            acceptQualityRange.map(accept => accept.toString())
        );
    }, []);
};
