'use strict';

const MediaRange = require('./MediaRange');

function isMediaRange(value) {
    return /.+\/.+/.test(value);
}

function isParameter(value) {
    return /.+=.+/.test(value);
}

function isNotQuality(value) {
    return !/q=.+/.test(value);
}

function typeSpecificity(type) {
    return (type !== '*') ? 1 : 0;
}

function specificity(accept) {
    return Object.values(accept.mediaRange)
        .reduce((sum, type) => (sum + typeSpecificity(type)), 0) + accept.parameters.length;
}

function trim(value) {
    return value.trim();
}

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = function (accepts = '') {
    if (typeof accepts !== 'string' || accepts.trim().length === 0) {
        return [];
    }

    let _accepts = accepts.split(',')
        .map(trim)
        .filter(isMediaRange)
        .map(mediaRange => {
            let parameters = mediaRange.split(';').map(trim).filter(isParameter).filter(isNotQuality);
            let match = mediaRange.match(/.+;\ ?q=(\d\.?\d{0,3})$/);
            let quality = Array.isArray(match) ? Number.parseFloat(match.pop()) : 1;
            let _mediaRange = new MediaRange(mediaRange);
            let _accept = {quality, mediaRange: _mediaRange, parameters};

            return {quality, mediaRange: _mediaRange, parameters, specificity: specificity(_accept)};
        });

    const qualities = Array.from(
        new Set(_accepts.map(accept => accept.quality))
    ).sort((a, b) => b - a);

    return qualities.map(quality => {
        let qualityRange = _accepts.filter(accept => (accept.quality === quality))
            .filter(accept => accept.quality !== 0);

        let apexSpecificity = qualityRange.reduce((apexSpecificity, accept) => {
            return (accept.specificity > apexSpecificity) ? accept.specificity : apexSpecificity;
        }, 0);

        let specificityRange = apexSpecificity;
        let sorted = [];

        do {
            qualityRange.filter(accept => {
                return (accept.specificity === specificityRange);
            }).forEach(accept => {
                sorted.push(accept);
            });
        } while (--specificityRange >= 0);

        return sorted;
    }).filter(quality => quality.length > 0).reduce((accumulator, qualityRange) => {
        return accumulator.concat(qualityRange.map(accept => {
            return (accept.parameters.length >= 1)
                ? [].concat([accept.mediaRange.toString(), accept.parameters]).join(';')
                : accept.mediaRange.toString();
        }));
    }, []);
};
