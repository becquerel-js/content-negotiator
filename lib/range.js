'use strict';

function rangeViaEnd(end) {
    return (new Array(end)).fill()
        .map((_, index) => index);
}

function rangeViaStartAndEnd(start, end) {
    return (new Array(end - start)).fill()
        .map((_, index) => index + start);
}

module.exports = function range(startOrEnd, maybeEnd) {
    const start = typeof maybeEnd === 'undefined' ? 0 : startOrEnd;
    const end = maybeEnd ?? startOrEnd;

    return start === 0 ? rangeViaEnd(end) : rangeViaStartAndEnd(start, end);
}
