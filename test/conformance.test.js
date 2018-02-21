const assert = require('assert')
const {parse, resolve} = require('url')
const parseurl = require('..')
const fixtures = require('./fixtures/url-tests.js')

const excludes = [
  /// strange schemes
  'a:%09%20foo.com',
  'lolscheme:x%20x#x%20x',
  /// port number exceeds 5 digits
  'http://f:00000000000000/c',
  'http://f:00000000000000000000080/c',
  'javascript:example.com/',
  'http://@www.example.com/',
  /// hostname missing
  'wow:%NBD',
  'wow:%1G',
  'ftp://%e2%98%83/',
  'https://%e2%98%83/',
  'about:\u0000\u001b\u0004\u0012%20http://example.com/\u001f',
  'about:h%09t%0At%0Dp://h%09o%0As%0Dt:9%090%0A0%0D0/p%09a%0At%0Dh?q%09u%0Ae%0Dry#f%09r%0Aa%0Dg',
  /// parseurl-fast always add a tailing `/` as path
  'sc://i',
  'sc://x',
  'sc://xn--ida',
  'sc://xn--ida?x',
  'sc://xn--ida#x',
  'a://test-a-colon-slash-slash.html',
  'a://test-a-colon-slash-slash-b.html'
]

const massage = obj => {
  Object.keys(obj).forEach(p => {
    if (obj[p] === undefined) obj[p] = null
  })
  delete obj._raw
  return obj
}

describe('conformance', function () {
  fixtures.forEach(test => {
    const resolved = resolve(test.base || '', test.input || '')
    if (test.failure || !resolved || excludes.includes(resolved)) return
    it('' + resolved, function () {
      const exp = parse(resolved)
      const res = massage(parseurl({url: resolved}))
      // console.log('%o', res)
      if (exp.hostname === '' && res.hostname === null) res.hostname = ''
      if (exp.host === null && res.host === '') res.host = null // only affects "javascript:"
      assert.deepEqual(res, exp)
    })
  })
})
