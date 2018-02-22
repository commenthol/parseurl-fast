
const PROTOCOL = /([a-z0-9.+-]{1,15}:)/.source
const SLASHES = /(\/\/|)/.source
const AUTH = /(?:([^@/?#]+?)@|@|)/.source
const HOST = /([^@/?#\s%;<>^{|}`"]*?)/.source
const PATHNAME = /(\/[^?#]*|)/.source
const SEARCH = /(\?[^#]*|)/.source
const HASH = /(#.*|)/.source

const HOSTNAME = /\[?(.+?)\]?/.source
const PORT = /(?::(\d{1,5})|)/.source

const URL = new RegExp(`^(?:${PROTOCOL}${SLASHES}${AUTH}${HOST}|)${PATHNAME}${SEARCH}${HASH}$`)
const HOSTNAME_PORT = new RegExp(`^${HOSTNAME}${PORT}$`)

function parse (url) {
  let href = url.trim()
  let [_a, protocol, slashes, auth, host, pathname, search, hash] = URL.exec(href) || // eslint-disable-line no-unused-vars
    [undefined, undefined, undefined, undefined, undefined, href, undefined, undefined]
  let [_b, hostname, port] = host ? HOSTNAME_PORT.exec(host) : [] // eslint-disable-line no-unused-vars
  if (slashes && hostname && !pathname) {
    pathname = '/'
    href += '/'
  }
  return {
    protocol,
    slashes: !!slashes || void (0),
    auth: auth ? decodeURIComponent(auth) : auth,
    hostname,
    port,
    host,
    pathname: pathname || void (0),
    path: (pathname || '') + (search || '') || void (0),
    search: search || void (0),
    query: search ? search.substr(1) : void (0),
    hash: hash || void (0),
    href,
    _raw: url
  }
}

function parseurl (req) {
  const {url, _parsedUrl} = req
  if (_parsedUrl && _parsedUrl._raw === url) {
    return _parsedUrl
  }
  if (!url && url !== '') return
  const parsed = req._parsedUrl = parse(url)
  return parsed
}

module.exports = parseurl
