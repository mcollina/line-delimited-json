'use strict'

var test = require('tap').test
var ldj = require('./')
var through = require('through2')
var net = require('net')
var counter = 9999

function nextPort () {
  return counter++
}

function ps () {
  return through(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  })
}

test('ldj sends objects through the line delimited json stream', function (t) {
  t.plan(1)

  var binary = ps()
  var instance = ldj(binary)
  var msg = { hello: 'world' }

  instance.on('data', function (chunk) {
    t.deepEqual(chunk, msg)
  })

  instance.end(msg)
})

test('ldj works with net streams', function (t) {
  t.plan(2)

  function handler (client) {
    var wrappedClient = ldj(client)
    wrappedClient.on('data', function (data) {
      t.deepEqual(data, { request: 'message' })
      wrappedClient.end({ response: '42' })
    })
  }

  var server = net.createServer(handler)
  var port = nextPort()

  server.listen(port)
  server.on('listening', function () {
    var client = ldj(net.connect(port))

    client.write({ request: 'message' })

    client.on('data', function (data) {
      t.deepEqual(data, { response: '42' })
      server.close()
    })
  })
})

test('ldj accepts plain strings / invalid json', function (t) {
  t.plan(1)

  var binary = ps()
  var instance = ldj(binary)
  var msg = 'test'

  instance.on('data', function (chunk) {
    t.deepEqual(chunk, msg)
  })

  instance.end(msg)
})
