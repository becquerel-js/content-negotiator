@becquerel/content-negotiator
=============================
[![npm Version][NPM VERSION BADGE]][NPM PAGE]
[![Node.js][NODE VERSION BADGE]][NODE PAGE]
[![GitHub License][LICENSE BADGE]][LICENSE PAGE]
[![Build Status][BUILD BADGE]][BUILD PAGE]

HTTP content negotiation library.

Install
-------
```sh
$ npm install --save @becquerel/content-negotiator  # Or alternately: `yarn add @becquerel/content-negotiator`
```

Usage
-----
```js
const ContentNegotiator = require('@becquerel/content-negotiator');

let acceptHeader = 'text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c';
let negotiator = new ContentNegotiator(acceptHeader);

/**
 * Use the `.prefer()` method to check if a media type is the prefered type of
 * the requester. You can also use "shorthand types" for the following
 * predefined types:
 *
 *     {
 *         html: 'text/html',
 *         jcard: 'application/vcard+json',
 *         json: 'application/json',
 *         jsonld: 'application/ld+json',
 *         vcard: 'text/vcard'
 *     };
 */
negotiator.prefers('text/html');  // > true
negotiator.prefers('html');       // > true
negotiator.prefers('text/plain'); // > false

/**
 * The `.mediaRanges` property contains a quality sorted array of the desired
 * media types.
 */
negotiator.mediaRanges; // > ['text/html', 'text/x-c', 'text/x-dvi', 'text/plain']
```

Testing
-------
```sh
$ npm test  # Or alternately: `yarn test`
```

Reference
---------
- [Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content &sect; 5.3: Content Negotiation](https://tools.ietf.org/html/rfc7231#section-5.3)

License
-------
The MIT License (Expat). See the [license file](LICENSE) for details.

[BUILD BADGE]: https://img.shields.io/travis/becquerel-js/content-negotiator.svg?style=flat-square
[BUILD PAGE]: https://travis-ci.org/becquerel-js/content-negotiator
[LICENSE BADGE]: https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square
[LICENSE PAGE]: https://github.com/becquerel-js/content-negotiator/blob/master/LICENSE
[NODE PAGE]: https://nodejs.org/
[NODE VERSION BADGE]: https://img.shields.io/badge/node-%3E%3D7.10-%23010101.svg
[NPM PAGE]: https://www.npmjs.com/package/@becquerel/content-negotiator
[NPM VERSION BADGE]: https://img.shields.io/npm/v/@becquerel/content-negotiator.svg?style=flat-square
