'use strict';

const Accept = require('./Accept');

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = function (accepts = '') {
    if (typeof accepts !== 'string' || accepts.trim().length === 0) {
        return [];
    }

    let _accepts = accepts.split(',')
        .map(accept => accept.trim())
        .filter(Accept.isMediaRange)
        .map(accept => new Accept(accept));

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
