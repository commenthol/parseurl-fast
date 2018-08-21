const origParseurl = require('parseurl')
const assert = require('assert')
const parseurl = require('..')
const {massage, isNull} = require('./support.js')

/**
 * Code taken from https://github.com/pillarjs/parseurl/test/test.js
 * @license MIT
 */

describe('parseurl(req)', function () {
  it('should parse the request URL', function () {
    var req = createReq('/foo/bar')
    var url = parseurl(req)
    assert.deepStrictEqual(url, {
      protocol: undefined,
      slashes: undefined,
      auth: undefined,
      host: undefined,
      hostname: undefined,
      port: undefined,
      pathname: '/foo/bar',
      path: '/foo/bar',
      search: undefined,
      query: undefined,
      hash: undefined,
      href: '/foo/bar',
      _raw: '/foo/bar'
    })
  })

  it('should parse with query string', function () {
    var req = createReq('/foo/bar?fizz=buzz')
    var url = parseurl(req)
    assert.deepStrictEqual(url, {
      protocol: undefined,
      slashes: undefined,
      auth: undefined,
      host: undefined,
      hostname: undefined,
      port: undefined,
      pathname: '/foo/bar',
      path: '/foo/bar?fizz=buzz',
      search: '?fizz=buzz',
      query: 'fizz=buzz',
      hash: undefined,
      href: '/foo/bar?fizz=buzz',
      _raw: '/foo/bar?fizz=buzz'
    })
  })

  it('should parse a full URL', function () {
    var req = createReq('http://localhost:8888/foo/bar')
    var url = parseurl(req)
    assert.deepStrictEqual(url, {
      protocol: 'http:',
      slashes: true,
      auth: undefined,
      host: 'localhost:8888',
      hostname: 'localhost',
      port: '8888',
      pathname: '/foo/bar',
      path: '/foo/bar',
      search: undefined,
      query: undefined,
      hash: undefined,
      href: 'http://localhost:8888/foo/bar',
      _raw: 'http://localhost:8888/foo/bar'
    })
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
  const fixtures = require('./fixtures/urls.js')
  fixtures.forEach((url) => {
    it(String(url), function () {
      const res = parseurl({url})
      const _exp = origParseurl({url})
      const exp = massage(_exp)
      if (exp && res && isNull(exp.host) === null && isNull(res.host) === null) res.host = exp.host
      // console.log('%o\n%o', res, exp)
      assert.deepStrictEqual(res, exp)
    })
  })
})
