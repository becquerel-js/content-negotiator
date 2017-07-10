const Accept = require('./Accept');
const range = require('./range');

const str = (value) => (value && value.toString) ? value.toString() : '';
const trim = (value) => value.trim();

module.exports = class AcceptArray extends Array {
    constructor(acceptHeader = '') {
        const accepts = str(acceptHeader).split(',')
            .map(trim)
            .filter(Accept.isMediaRange)
            .map(accept => new Accept(accept));

        super(...accepts);
    }

    get maxSpecificity() {
        return Math.max(...this.specificities);
    }

    get qualities() {
        return this.map(accept => accept.quality);
    }

    get specificities() {
        return this.map(accept => accept.specificity);
    }

    get uniqueQualities() {
        return Array.from(new Set(this.qualities));
    }

    get uniqueSortedQualities() {
        return this.uniqueQualities.sort((a, b) => b - a);
    }

    quality(quality) {
        return this.filter(accept => (accept.quality === quality));
    }

    specificity(specificity) {
        return this.filter(accept => (accept.specificity === specificity));
    }

    sortBySpecificity() {
        return range(this.maxSpecificity).reverse()
            .reduce((sorted, specificity) => {
                return sorted.concat(this.specificity(specificity));
            }, []);
    }
};