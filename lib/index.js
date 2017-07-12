'use strict';

const MediaType = require('./MediaType');
const MediaTypeArray = require('./MediaTypeArray');
const MediaTypeQualityMap = require('./MediaTypeQualityMap');

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = class ContentNegotiator {
    constructor(acceptHeader = '') {
        const mediaTypes = new MediaTypeArray(
            ...acceptHeader.split(',')
                .map(str => str.trim())
                .filter(MediaType.isValue)
                .map(str => new MediaType(str))
        );

        this.qualityMap = ContentNegotiator.getQualityMap(mediaTypes);
    }

    static getQualityMap(mediaTypes) {
        return mediaTypes.uniqueSortedQualities.reduce((map, quality) => {
            return map.set(quality, mediaTypes.getQuality(quality).sortBySpecificity());
        }, new MediaTypeQualityMap());
    }

    get mediaRanges() {
        // Clone the quality map so we still have an unmodified instance map.
        let qualityMap = new Map(this.qualityMap);

        qualityMap.delete(0);

        return Array.from(qualityMap.values()).reduce((accumulator, mediaTypeQualityRange) => {
            return accumulator.concat(
                mediaTypeQualityRange.map(mediaType => mediaType.toString())
            );
        }, []);
    }

    prefer(mediaType = '') {
        const typeMap = {
            html: new MediaType('text/html'),
            jcard: new MediaType('application/vcard+json'),
            json: new MediaType('application/json'),
            jsonld: new MediaType('application/ld+json'),
            vcard: new MediaType('text/vcard')
        };

        const preferredMedia = this.preferred;

        const requestedMedia = (mediaType in typeMap)
            ? typeMap[mediaType]
            : new MediaType(mediaType);

        return (
            (
                preferredMedia.type === requestedMedia.type ||
                preferredMedia.type === '*'
            ) &&
            (
                preferredMedia.subtype === requestedMedia.subtype ||
                preferredMedia.subtype === '*'
            )
        );
    }

    get preferred() {
        const quality = this.qualityMap.maxQuality;
        const qualityRange = this.qualityMap.get(quality);

        return Array.isArray(qualityRange)
            ? qualityRange.slice().shift()
            : new MediaType();
    }
};
