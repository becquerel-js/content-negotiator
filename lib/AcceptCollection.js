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
};
