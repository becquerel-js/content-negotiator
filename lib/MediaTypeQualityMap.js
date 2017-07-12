module.exports = class MediaTypeQualityMap extends Map {
    constructor(...args) {
        super(...args);
    }

    get maxQuality() {
        return Math.max(...Array.from(this.keys()));
    }
};
