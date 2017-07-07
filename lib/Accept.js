const MediaRange = require('./MediaRange');

module.exports = class Accept {
    constructor(accept = '') {
        this.quality = Accept.getQuality(accept);
        this.mediaRange = new MediaRange(accept);
        this.parameters = Accept.getParameters(accept);
        this.specificity = Object.values(this.mediaRange)
            .reduce((sum, type) => (sum + Accept.getTypeSpecificity(type)), 0)
            + this.parameters.length;
    }

    static getParameters(accept = '') {
        return accept.split(';')
            .map(value => value.trim())
            .filter(Accept.isParameter)
            .filter(Accept.isNotQuality);
    }

    static getQuality(accept = '') {
        let match = accept.match(/.+;\ ?q=(\d\.?\d{0,3})$/);

        return Array.isArray(match) ? Number.parseFloat(match.pop()) : 1;
    }

    static getTypeSpecificity(type = '') {
        return (type !== '*') ? 1 : 0;
    }

    static isMediaRange(value) {
        return /.+\/.+/.test(value);
    }

    static isNotQuality(value) {
        return !/q=.+/.test(value);
    }

    static isNotZeroQuality(accept) {
        return (accept.quality !== 0);
    }

    static isParameter(value) {
        return /.+=.+/.test(value);
    }

    toString() {
        return (this.parameters.length >= 1)
            ? [].concat([this.mediaRange.toString(), this.parameters]).join(';')
            : this.mediaRange.toString();
    }
};
