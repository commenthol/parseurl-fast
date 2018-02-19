
// ------------- protocol ---------------- auth --------hostname -- path ---- search --- hash ----
const URL = /^(?:(https?:|ftp:|gopher:)\/\/(?:([^@]+)@|)([^/?#]*)|)(\/[^?#]*|)(\?[^?#]*|)(#.*|)$/
const HOST_PORT = /^\[?(.+?)\]?(?::(\d{2,5})|)$/

function parse (url) {
  let href = url.trim()
  let [_a, protocol, auth, host, pathname, search, hash] = URL.exec(href) || // eslint-disable-line no-unused-vars
    [undefined, undefined, undefined, undefined, href, undefined, undefined]
  let [_b, hostname, port] = host ? HOST_PORT.exec(host) : [] // eslint-disable-line no-unused-vars
  if (hostname && !pathname) {
    pathname = '/'
    href += '/'
  }
  return {
    protocol,
    slashes: !!protocol || void (0),
    auth,
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
