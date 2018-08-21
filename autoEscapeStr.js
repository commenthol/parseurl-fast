// From https://github.com/nodejs/node/lib/url.js

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

const escapedCodes = [
  /* 0 - 9 */ '', '', '', '', '', '', '', '', '', '%09',
  /* 10 - 19 */ '%0A', '', '', '%0D', '', '', '', '', '', '',
  /* 20 - 29 */ '', '', '', '', '', '', '', '', '', '',
  /* 30 - 39 */ '', '', '%20', '', '%22', '', '', '', '', '%27',
  /* 40 - 49 */ '', '', '', '', '', '', '', '', '', '',
  /* 50 - 59 */ '', '', '', '', '', '', '', '', '', '',
  /* 60 - 69 */ '%3C', '', '%3E', '', '', '', '', '', '', '',
  /* 70 - 79 */ '', '', '', '', '', '', '', '', '', '',
  /* 80 - 89 */ '', '', '', '', '', '', '', '', '', '',
  /* 90 - 99 */ '', '', '%5C', '', '%5E', '', '%60', '', '', '',
  /* 100 - 109 */ '', '', '', '', '', '', '', '', '', '',
  /* 110 - 119 */ '', '', '', '', '', '', '', '', '', '',
  /* 120 - 125 */ '', '', '', '%7B', '%7C', '%7D'
]

// Automatically escape all delimiters and unwise characters from RFC 2396.
// Also escape single quotes in case of an XSS attack.
// Return the escaped string.
function autoEscapeStr (str) {
  var escaped = ''
  var lastEscapedPos = 0
  for (var i = 0; i < str.length; ++i) {
    // `escaped` contains substring up to the last escaped character.
    var escapedChar = escapedCodes[str.charCodeAt(i)]
    if (escapedChar) {
      // Concat if there are ordinary characters in the middle.
      if (i > lastEscapedPos) { escaped += str.slice(lastEscapedPos, i) }
      escaped += escapedChar
      lastEscapedPos = i + 1
    }
  }
  if (lastEscapedPos === 0) { // Nothing has been escaped.
    return str
  }

  // There are ordinary characters at the end.
  if (lastEscapedPos < str.length) { escaped += str.slice(lastEscapedPos) }

  return escaped
}

module.exports = {
  autoEscapeStr
}
