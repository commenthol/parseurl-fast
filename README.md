# parseurl-fast

> A fast url parser

[![NPM version](https://badge.fury.io/js/parseurl-fast.svg)](https://www.npmjs.com/package/parseurl-fast/)
[![Build Status](https://secure.travis-ci.org/commenthol/parseurl-fast.svg?branch=master)](https://travis-ci.org/commenthol/parseurl-fast)

Parses an url with memoization using a single safe regex.
Targets node only, so don't try to use in browser.
Focuses on urls used at the server side.

Returns same parsing result as [url.parse][] except:
- Does not parse `javascript` URIs
- Does not parse some schemes. Please check `excludes` in `test/conformance.test.js`

## Usage

Install with

```bash
npm i -S parseurl-fast
```

Parse an Url with:

```js
const parseurl = require('parseurl-fast')

const url = 'https://www.host.name:4000/path?query#hash'
const parsed = parseurl({url})
//> {
//>   protocol: 'https:',
//>   ...
//> }
```

## Benchmarks

```
$ npm run benchmark

---- url ----

node url.parse   x 93,003 ops/sec ±2.51% (84 runs sampled)
parseurl         x 96,880 ops/sec ±1.43% (86 runs sampled)
parseurl-fast    x 315,786 ops/sec ±1.67% (90 runs sampled)
Fastest is parseurl-fast

---- long url ~8000 chars ----

node url.parse   x 2,820 ops/sec ±1.42% (88 runs sampled)
parseurl         x 2,842 ops/sec ±1.14% (90 runs sampled)
parseurl-fast    x 73,371 ops/sec ±1.91% (90 runs sampled)
Fastest is parseurl-fast
```

## Security recommendations

This module can parse an infinite number of chars.
To comply with [RFC 7230 Section 3.1.1][] which recommends a minimum of 8000 octets,
you should limit the max. number of chars to such or even smaller extent (depends on your app).
In such case respond with a 414 status code.
The longer the urls the longer the parsing.

E.g. if using connect middlewares, do sth. like this:

```js
const parseurl = require('parseurl-fast')

app.use((req, res, next) => {
  let err
  if (req.url.length <= 8000) {
    parseurl(req)
  } else {
    err = new Error('URI Too Long')
    err.status = 414
  }
  next(err)
})
```

This module uses Regular Expressions for parsing, which may be subject to [ReDoS][] attacks. Anyhow those expressions implemented should not contain any nondeterministic/ harmful states. The [redos](https://npmjs.org/package/redos) tool, was used to trace irregularities during development - check with `npm run redos`.

## License

[MIT Licensed](./LICENSE.md)


## References

- [url.parse][]
- [parseurl][]

[url.parse]: https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost
[RFC 7230 Section 3.1.1]: https://tools.ietf.org/html/rfc7230#section-3.1.1
[ReDoS]: https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
[parseurl]: 'https://npmjs.com/package/parseurl'
