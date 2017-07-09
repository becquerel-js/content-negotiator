'use strict';

module.exports = (start, end) => {
    return (new Array((end - start || start) + Math.abs(end ? start : 1))).fill()
        .map((value, index) => index + (end ? start : 0));
};
