'use strict';

const MediaType = require('./MediaType');
const MediaTypeArray = require('./MediaTypeArray');
const MediaTypeQualityMap = require('./MediaTypeQualityMap');

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = function (acceptHeader = '') {
    let mediaTypes = new MediaTypeArray(
        ...acceptHeader.split(',')
            .map(str => str.trim())
            .filter(MediaType.isValue)
            .map(str => new MediaType(str))
    );

    let qualityMap = mediaTypes.uniqueSortedQualities.reduce((map, quality) => {
        return map.set(quality, mediaTypes.getQuality(quality).sortBySpecificity());
    }, new MediaTypeQualityMap());

    qualityMap.delete(0);

    return Array.from(qualityMap.values()).reduce((accumulator, mediaTypeQualityRange) => {
        return accumulator.concat(
            mediaTypeQualityRange.map(mediaType => mediaType.toString())
        );
    }, []);
};
