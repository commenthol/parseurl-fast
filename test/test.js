const origParseurl = require('parseurl')
const assert = require('assert')
const parseurl = require('..')

/**
* Code taken from https://github.com/pillarjs/parseurl/test/test.js
* @license MIT
*/

describe('parseurl(req)', function () {
  it('should parse the request URL', function () {
    var req = createReq('/foo/bar')
    var url = parseurl(req)
    assert.equal(url.host, null)
    assert.equal(url.hostname, null)
    assert.equal(url.href, '/foo/bar')
    assert.equal(url.pathname, '/foo/bar')
    assert.equal(url.port, null)
    assert.equal(url.query, null)
    assert.equal(url.search, null)
  })

  it('should parse with query string', function () {
    var req = createReq('/foo/bar?fizz=buzz')
    var url = parseurl(req)
    assert.equal(url.host, null)
    assert.equal(url.hostname, null)
    assert.equal(url.href, '/foo/bar?fizz=buzz')
    assert.equal(url.pathname, '/foo/bar')
    assert.equal(url.port, null)
    assert.equal(url.query, 'fizz=buzz')
    assert.equal(url.search, '?fizz=buzz')
  })

  it('should parse a full URL', function () {
    var req = createReq('http://localhost:8888/foo/bar')
    var url = parseurl(req)
    assert.equal(url.host, 'localhost:8888')
    assert.equal(url.hostname, 'localhost')
    assert.equal(url.href, 'http://localhost:8888/foo/bar')
    assert.equal(url.pathname, '/foo/bar')
    assert.equal(url.port, '8888')
    assert.equal(url.query, null)
    assert.equal(url.search, null)
  })

  it('should not choke on auth-looking URL', function () {
    var req = createReq('//todo@txt')
    assert.equal(parseurl(req).pathname, '//todo@txt')
  })

  it('should return undefined missing url', function () {
    var req = createReq()
    var url = parseurl(req)
    assert.strictEqual(url, undefined)
  })

  describe('when using the same request', function () {
    it('should parse multiple times', function () {
      var req = createReq('/foo/bar')
      assert.equal(parseurl(req).pathname, '/foo/bar')
      assert.equal(parseurl(req).pathname, '/foo/bar')
      assert.equal(parseurl(req).pathname, '/foo/bar')
    })

    it('should reflect url changes', function () {
      var req = createReq('/foo/bar')
      var url = parseurl(req)
      var val = Math.random()

      url._token = val
      assert.equal(url._token, val)
      assert.equal(url.pathname, '/foo/bar')

      req.url = '/bar/baz'
      url = parseurl(req)
      assert.equal(url._token, undefined)
      assert.equal(parseurl(req).pathname, '/bar/baz')
    })

    it('should cache parsing', function () {
      var req = createReq('/foo/bar')
      var url = parseurl(req)
      var val = Math.random()

      url._token = val
      assert.equal(url._token, val)
      assert.equal(url.pathname, '/foo/bar')

      url = parseurl(req)
      assert.equal(url._token, val)
      assert.equal(url.pathname, '/foo/bar')
    })

    it('should cache parsing where href does not match', function () {
      var req = createReq('/foo/bar ')
      var url = parseurl(req)
      var val = Math.random()

      url._token = val
      assert.equal(url._token, val)
      assert.equal(url.pathname, '/foo/bar')

      url = parseurl(req)
      assert.equal(url._token, val)
      assert.equal(url.pathname, '/foo/bar')
    })
  })
})

function createReq (url, originalUrl) {
  return {
    originalUrl: originalUrl,
    url: url
  }
}

/**
* New additional tests
*/

describe('should parse the same as parseurl', function () {
  const fixtures = [
    undefined,
    '',
    '/',
    '/////',
    '/this/is/a/path',
    '/this/is/a/path',
    '/path/with/tailing/spaces     \t',
    '/this/is/a/path/?a=1&b=2',
    '/this/is/a/path/?a=1&b=2#hash',
    '/this/is/a/path/a=1&b=2',
    '/this/is/a/path#hash',
    '/this/is/a/path?#hash',
    '?a=1&b=2',
    'a=1&b=2',
    '#hash',
    'www.host.name',
    'http://www.host.name',
    'https://www.host.name',
    'https://127.0.0.127',
    'https://[2001:0db8:0000:0042:0000:8a2e:0370:7334]:3000',
    'https://[2001:db8::ff00:42:8329]/path',
    'https://[2001:db8::ff00:42:8329]:8080/path',
    'https://[::1]/path',
    'ftp://www.host.name',
    'gopher://www.host.name',
    'http://www.host.name/this/is/a/path',
    'http://www.host.name/this/is/a/path/?a=1&b=2',
    'http://www.host.name/this/is/a/path/?a=1&b=2#hash',
    'http://www.host.name:8080',
    'http://www.host.name:8080/this/is/a/path',
    'http://www.host.name:8080/this/is/a/path/?a=1&b=2',
    'http://www.host.name:8080/this/is/a/path/?a=1&b=2#hash',
    'http://basic:auth@www.host.name',
    'http://basic:auth@www.host.name/this/is/a/path',
    'http://basic:auth@www.host.name/this/is/a/path/?a=1&b=2',
    'http://basic:auth@www.host.name/this/is/a/path/?a=1&b=2#hash'
  ]
  fixtures.forEach((url) => {
    it(String(url), function () {
      const res = parseurl({url})
      const exp = origParseurl({url})
      // console.log('%o\n%o',res, exp)
      if (exp) {
        Object.keys(exp).forEach((p) => {
          if (exp[p] === null) exp[p] = void (0)
        })
      }
      assert.deepEqual(res, exp)
    })
  })
})
