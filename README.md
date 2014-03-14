line-delimited-json&nbsp;&nbsp;[![Build Status](https://travis-ci.org/mcollina/line-delimited-json.png)](https://travis-ci.org/mcollina/line-delimited-json)
=================================================================

Send you JS objects over a string using JSONs delimited by a newline.

  * <a href="#install">Installation</a>
  * <a href="#example">Example</a>
  * <a href="#licence">Licence &amp; copyright</a>

<a name="install"></a>
## Installation

```
$ npm install line-delimited-json --save
```

<a name="example"></a>
## Example

```js

  var net = require('net')
    , ldj = require('line-delimited-json')

  function handler(client) {
    var wrappedClient = ldj(client)
    wrappedClient.on('data', function(data) {
      console.log('request', data)
      wrappedClient.end({ response: '42' })
    })
  }

  var server  = net.createServer(handler)
    , port    = 9999

  server.listen(port)
  server.on('listening', function() {
    var client = ldj(net.connect(port))

    client.write({ request: 'message' })

    client.on('data', function(data) {
      console.log('response', data)
      server.close()
    })
  })
```

## LICENSE

Copyright (c) 2014, Matteo Collina <hello@matteocollina.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
