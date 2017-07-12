module.exports = class MediaType {
    constructor(value) {
        let tokens = MediaType.getTokens(value);
        [this.type, this.subtype] = MediaType.getTypeSubtypePair(tokens.shift());
        this.parameters = MediaType.getParameters(tokens);
        this.specificity = this.getSpecificity();
    }

    static assignPairToParameters(parameters, pair) {
        return Object.assign(parameters, {[pair.shift()]: pair.shift()});
    }

    static getParameters(tokens) {
        const defaults = {q: 1};
        const parameters = tokens.map(MediaType.getParameterTokenPair)
                .map(MediaType.parseFloatOnQualityPairValue)
                .reduce(MediaType.assignPairToParameters, {});

        return Object.assign({}, defaults, parameters);
    }

    static getParameterTokenPair(token) {
        return token.split('=').map(str => str.trim());
    }

    getSpecificity() {
        return (
            MediaType.getTypeSpecificity(this.type) +
            MediaType.getTypeSpecificity(this.subtype) +
            Object.keys(this.parameters).filter(key => (key !== 'q')).length
        );
    };

    static isValue(value) {
        return /.+\/.+/.test(value);
    }

    toString() {
        const mediaRange = `${this.type}/${this.subtype}`;
        const parameters = Object.entries(this.parameters)
            .filter(pair => (pair[0] !== 'q'))
            .map(pair => pair.join('='));


        return (parameters.length >= 1)
            ? [].concat([mediaRange, parameters]).join(';')
            : mediaRange;

    }

    static getTokens(value) {
        return (value || '').split(';').map(str => str.trim());
    }

    static getTypeSpecificity(type = '') {
        return (type !== '*') ? 1 : 0;
    }

    static getTypeSubtypePair(token) {
        return token.split('/').map(str => str.trim());
    }

    static isQualityPair(pair) {
        return (Array.isArray(pair) && pair[0] === 'q');
    }

    static parseFloatOnPairValue(pair) {
        return [pair.shift(), Number.parseFloat(pair.shift())];
    }

    static parseFloatOnQualityPairValue(pair) {
        return MediaType.isQualityPair(pair)
            ? MediaType.parseFloatOnPairValue(pair)
            : pair;
    }
};
