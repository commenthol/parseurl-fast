const assert = require('assert')
const {parse} = require('url')
const {massage, isNull} = require('./support.js')
const parseurl = require('..')
const fixtures = require('./fixtures/url-tests.js')

const excludes = [
  'a: foo.com',
  'lolscheme:x x#x%20x', // strange scheme
  'http://&a:foo(b%5Dc@d:2/',
  'http://:%3A%40c@d:2/',
  'javascript:example.com/', // no support for hostless protocols
  'sc://fa%C3%9F.ExAmPlE/',
  'data:,#x', // `,` detected as hostname
  'sc://%C3%B1.test/',
  'sc://%1F!"$&\'()*+,-.;<=>^_`{|}~/',
  'sc://%/', // false detected hostname
  'sc://%C3%B1/x', // correct detected hostname but different
  'sc:\\../', // no host scheme checking
  'wow:%NBD',
  'wow:%1G',
  'file://host/dir/C|a',
  'sc://%C3%B1',
  'sc://%C3%B1?x',
  'sc://%C3%B1#x',
  'urn:ietf:rfc:2648', // strange scheme
  'tag:joe@example.org,2001:foo/bar', // bad segementation at sub-delims boundary
  'non-special://%E2%80%A0/', // bad hostname
  'non-special://H%4fSt/path',
  'blob:https://example.com:443/' // bad href
]

describe('conformance', function () {
  fixtures.forEach(test => {
    const resolved = test.href // resolve(test.base || '', test.input || '')
    if (test.failure || !resolved || excludes.includes(resolved)) return
    it('' + resolved, function () {
      const _exp = parse(resolved)
      const exp = massage(_exp)
      const res = parseurl({url: resolved})
      // console.log('%o %o', res, _exp)
      if (exp.hostname === '' && isNull(res.hostname)) res.hostname = exp.hostname
      if (isNull(exp.host) && isNull(res.host)) res.host = exp.host
      if (!exp._raw) exp._raw = res._raw
      assert.deepStrictEqual(res, exp)
    })
  })
})
