const Accept = require('./Accept');

const max = (a, b) => (a > b) ? a : b;
const str = (value) => (value && value.toString) ? value.toString() : '';
const trim = (value) => value.trim();

module.exports = class AcceptCollection {
    constructor(acceptHeader = '') {
        this.values = str(acceptHeader).split(',')
            .map(trim)
            .filter(Accept.isMediaRange)
            .map(accept => new Accept(accept));
    }

    get qualities() {
        return this.values.map(accept => accept.quality);
    }

    get maxSpecificity() {
        return this.specificities.reduce(max, 0);
    }

    get specificities() {
        return this.values.map(accept => accept.specificity);
    }

    get uniqueQualities() {
        return Array.from(new Set(this.qualities));
    }

    get uniqueSortedQualities() {
        return this.uniqueQualities.sort((a, b) => b - a);
    }

    getValuesByQuality(quality) {
        return this.values.filter(accept => (accept.quality === quality));
    }

    filterByQuality(quality) {
        const isQuality = (accept) => (accept.quality === quality);

        return AcceptCollection.fromValues(this.values.filter(isQuality));
    }

    filterBySpecificity(specificity) {
        const isSpecificity = (accept) => (accept.specificity === specificity);

        return AcceptCollection.fromValues(this.values.filter(isSpecificity));
    }

    static fromValues(values = []) {
        const collection = new AcceptCollection();
        collection.values = values;

        return collection;
    }
};
