const Benchmark = require('benchmark')

const node = require('url')
const parseurl = require('parseurl')
const parseurlFast = require('..')

const getUrl = () => `https://auth:pass@${String(Math.random()).substr(2)}.host.domain:4000/the/path/name/is/${Math.random()}?query=1&test=1#hash`

const LEN = 8000
const long = Array(LEN).fill('a').join('')
const getLongUrl = () => `https://auth:pass@${String(Math.random()).substr(2)}.host.domain:4000/${long}?aa`

const rpad = (str, n = 16) => (str + Array(n).fill(' ').join('')).substr(0, n)

console.log('\n---- url ----\n')

Benchmark.Suite()
  .add(rpad('node url.parse'), function () {
    const url = getUrl()
    node.parse(url)
  })
  .add(rpad('parseurl'), function () {
    const url = getUrl()
    parseurl({url})
  })
  .add(rpad('parseurl-fast'), function () {
    const url = getUrl()
    parseurlFast({url})
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ 'async': false })

console.log(`\n---- long url ~${LEN} chars ----\n`)

Benchmark.Suite()
  .add(rpad('node url.parse'), function () {
    const url = getLongUrl()
    node.parse(url)
  })
  .add(rpad('parseurl'), function () {
    const url = getLongUrl()
    parseurl({url})
  })
  .add(rpad('parseurl-fast'), function () {
    const url = getLongUrl()
    parseurlFast({url})
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ 'async': false })
