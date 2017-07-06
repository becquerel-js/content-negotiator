module.exports = class MediaRange {
    constructor(mediaRange) {
        [this.type, this.subtype] = mediaRange.split(';')[0].split('/');
    }

    toString() {
        return `${this.type}/${this.subtype}`;
    }
}
