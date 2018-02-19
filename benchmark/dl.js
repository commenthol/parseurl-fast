const fs = require('fs')
const https = require('https')
const parseurlFast = require('..')
const url = 'https://raw.githubusercontent.com/nodejs/node/master/lib/url.js'
const filename = `${__dirname}/url.js`

const download = () => {
  const opts = parseurlFast({url})
  opts.method = 'GET'

  https.request(opts, res => {
    res.pipe(fs.createWriteStream(filename))
  }).end()
}

fs.stat(filename, err => {
  if (err) download()
})
