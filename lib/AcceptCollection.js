const Accept = require('./Accept');

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

    get uniqueQualities() {
        return Array.from(new Set(this.qualities));
    }

    get uniqueSortedQualities() {
        return this.uniqueQualities.sort((a, b) => b - a);
    }

    getValuesByQuality(quality) {
        return this.values.filter(accept => (accept.quality === quality));
    }
};
