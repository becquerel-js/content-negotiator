const range = require('./range');

module.exports = class MediaTypeArray extends Array {
    constructor(...args) {
        super(...args);
    }

    get maxQuality() {
        return Math.max(...this.qualities);
    }

    get maxSpecificity() {
        return Math.max(...this.specificities);
    }

    get qualities() {
        return this.map(mediaType => mediaType.parameters.q);
    }

    getQuality(quality) {
        return this.filter(mediaType => (mediaType.parameters.q === quality));
    }

    getSpecificity(specificity) {
        return this.filter(mediaType => (mediaType.specificity === specificity));
    }

    sortBySpecificity() {
        return range(this.maxSpecificity).reverse()
            .reduce((sorted, specificity) => {
                return sorted.concat(this.getSpecificity(specificity));
            }, []);
    }

    get specificities() {
        return this.map(mediaType => mediaType.specificity);
    }

    get uniqueQualities() {
        return Array.from(new Set(this.qualities));
    }

    get uniqueSortedQualities() {
        return this.uniqueQualities.sort((a, b) => b - a);
    }
};
