# parseurl-fast

> A fast url parser

[![NPM version](https://badge.fury.io/js/parseurl-fast.svg)](https://www.npmjs.com/package/parseurl-fast/)
[![Build Status](https://secure.travis-ci.org/commenthol/parseurl-fast.svg?branch=master)](https://travis-ci.org/commenthol/parseurl-fast)

Parses an url with memoization using a single safe regex.
Returns same parsing result as [url.parse][] except:
- Does not parse file URIs `file://`
- Does not parse `javascript` URIs

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

node url.parse   x 91,182 ops/sec ±2.89% (77 runs sampled)
parseurl         x 95,542 ops/sec ±1.62% (87 runs sampled)
parseurl-fast    x 369,557 ops/sec ±2.81% (86 runs sampled)
Fastest is parseurl-fast   

---- long url ~8000 chars ----

node url.parse   x 2,698 ops/sec ±1.59% (88 runs sampled)
parseurl         x 2,748 ops/sec ±1.33% (88 runs sampled)
parseurl-fast    x 77,960 ops/sec ±2.06% (89 runs sampled)
Fastest is parseurl-fast  
```

## Security recommendations

This module can parse an infinite number of chars.
To comply with [RFC 7230 Section 3.1.1][] which recommends a minimum of 8000 octets,
you should limit the max. number of chars to such extent.
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

This module uses Regular Expressions for parsing, which may be subject to [ReDoS][] attacks. Anyhow those expressions implemented should not contain any nondeterministic/ harmful states. `npm run redos`, which runs the [redos](https://npmjs.org/package/redos) tool, was used to trace irregularities during development.

## License

[MIT Licensed](./LICENSE.md)

[url.parse]: https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost
[RFC 7230 Section 3.1.1]: https://tools.ietf.org/html/rfc7230#section-3.1.1
[ReDoS]: https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
