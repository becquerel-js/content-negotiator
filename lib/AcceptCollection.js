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

    filterByQuality(quality) {
        const isQuality = (accept) => (accept.quality === quality);

        return AcceptCollection.fromValues(this.values.filter(isQuality));
    }

    filterBySpecificity(specificity) {
        const isSpecificity = (accept) => (accept.specificity === specificity);

        return AcceptCollection.fromValues(this.values.filter(isSpecificity));
    }

    static fromValues(values = []) {
        return Object.assign(new AcceptCollection(), {values});
    }

    sortBySpecificity() {
        const range = (start, end) => {
            return (new Array((end - start || start) + Math.abs(end ? start : 1))).fill()
                .map((value, index) => index + (end ? start : 0));
        };

        const sortedValues = range(this.maxSpecificity).reverse()
            .reduce((sorted, specificity) => {
                const filtered = this.filterBySpecificity(specificity);

                return sorted.concat(filtered.values);
            }, []);

        return AcceptCollection.fromValues(sortedValues);
    }
};
