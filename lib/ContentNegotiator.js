const MediaType = require('./MediaType');
const MediaTypeArray = require('./MediaTypeArray');
const MediaTypeQualityMap = require('./MediaTypeQualityMap');

/**
 * @see https://tools.ietf.org/html/rfc7231#section-5.3.2
 */
module.exports = class ContentNegotiator {
    constructor(acceptHeader = '') {
        const mediaTypes = new MediaTypeArray(
            ...(acceptHeader).split(',')
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

    get mediaRange() {
        // Clone the quality map so we still have an unmodified instance map.
        let qualityMap = new Map(this.qualityMap);

        qualityMap.delete(0);

        return Array.from(qualityMap.values()).reduce((accumulator, mediaTypeQualityRange) => {
            return accumulator.concat(
                mediaTypeQualityRange.map(mediaType => mediaType.toString())
            );
        }, []);
    }

    prefers(mediaType = '') {
        const typeMap = {
            html: 'text/html',
            jcard: 'application/vcard+json',
            json: 'application/json',
            jsonld: 'application/ld+json',
            vcard: 'text/vcard'
        };

        const preferredMedia = this.preferred;
        const requestedMedia = new MediaType(typeMap[mediaType] || mediaType);

        return (
            (
                preferredMedia.type === requestedMedia.type ||
                preferredMedia.type === '*'
            ) &&
            (
                preferredMedia.subtype === requestedMedia.subtype ||
                preferredMedia.subtype === '*'
            ) &&
            (
                Object.keys(preferredMedia.parameters).filter(key => (key !== 'q')).every(key => {
                    return (preferredMedia.parameters[key] === requestedMedia.parameters[key]);
                })
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
