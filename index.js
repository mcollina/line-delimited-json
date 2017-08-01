'use strict'

var split = require('split2')
var duplexer = require('reduplexer')
var through = require('through2')

function jsonParse (line) {
  var rv = {}
  try {
    rv = JSON.parse(line)
  } catch (err) {
    rv.err = err
    rv.line = line
  }
  return rv
}

function lineDelimitedJSON (duplex) {
  var readable = duplex.pipe(split(jsonParse))
  var writable = through({ objectMode: true }, function (chunk, enc, cb) {
    this.push(JSON.stringify(chunk), 'utf8')
    this.push('\n', 'utf8')

    cb()
  })

  writable.pipe(duplex)

  return duplexer(writable, readable, { objectMode: true })
}

module.exports = lineDelimitedJSON
