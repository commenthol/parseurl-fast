/* eslint no-console: 0 */

const fs = require('fs')
const https = require('https')
const parseurlFast = require('..')

const config = {
  // 'https://raw.githubusercontent.com/nodejs/node/master/lib/url.js':
  //   `${__dirname}/../benchmark/url.js`,
  'https://raw.githubusercontent.com/nodejs/node/master/test/fixtures/url-tests.js':
    `${__dirname}/../test/fixtures/url-tests.js`
}

const download = (url, filename) => {
  fs.stat(filename, err => {
    if (!err) return
    console.log('downloading %s from %s', filename, url)

    const opts = parseurlFast({url})
    opts.method = 'GET'

    https.request(opts, res => {
      res.pipe(fs.createWriteStream(filename))
    }).end()
  })
}

Object.keys(config).forEach(url => {
  const filename = config[url]
  download(url, filename)
})
