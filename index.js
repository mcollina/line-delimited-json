
var split     = require('split2')
  , duplexer  = require('reduplexer')
  , through   = require('through2')

function lineDelimitedJSON(duplex) {

  var readable  = duplex.pipe(split(JSON.parse))
    , writable  = through({ objectMode: true }, function(chunk, enc, cb) {
                    this.push(JSON.stringify(chunk), 'utf8')
                    this.push('\n', 'utf8')

                    cb()
                  })

  writable.pipe(duplex)

  return duplexer(writable, readable, { objectMode: true })
}

module.exports = lineDelimitedJSON
