const parallel = require('run-parallel')

function makeBuffer (num) {
  const buf = Buffer.alloc(10)
  buf.fill(num)
  return buf
}

module.exports = function (test, Store) {
  test('basic put, then get', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123456789'), function (err) {
      t.error(err)
      store.get(0, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, Buffer.from('0123456789'))
        store.destroy(function (err) {
          t.error(err)
          t.end()
        })
      })
    })
  })

  test('put invalid chunk length gives error', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123'), function (err) {
      t.ok(err instanceof Error)
      store.destroy(function (err) {
        t.error(err)
        t.end()
      })
    })
  })

  test('concurrent puts, then concurrent gets', function (t) {
    const store = new Store(10)

    function makePutTask (i) {
      return function (cb) {
        store.put(i, makeBuffer(i), cb)
      }
    }

    function makeGetTask (i) {
      return function (cb) {
        store.get(i, function (err, data) {
          if (err) return cb(err)
          t.deepEqual(data, makeBuffer(i))
          cb(null)
        })
      }
    }

    let tasks = []
    for (let i = 0; i < 100; i++) {
      tasks.push(makePutTask(i))
    }

    parallel(tasks, function (err) {
      t.error(err)

      tasks = []
      for (let i = 0; i < 100; i++) {
        tasks.push(makeGetTask(i))
      }

      parallel(tasks, function (err) {
        t.error(err)
        store.destroy(function (err) {
          t.error(err)
          t.end()
        })
      })
    })
  })

  test('interleaved puts and gets', function (t) {
    const store = new Store(10)
    const tasks = []

    function makeTask (i) {
      return function (cb) {
        store.put(i, makeBuffer(i), function (err) {
          if (err) return cb(err)
          store.get(i, function (err, data) {
            t.error(err)
            t.deepEqual(data, makeBuffer(i))
            cb(null)
          })
        })
      }
    }

    for (let i = 0; i < 100; i++) {
      tasks.push(makeTask(i))
    }

    parallel(tasks, function (err) {
      t.error(err)
      store.destroy(function (err) {
        t.error(err)
        t.end()
      })
    })
  })

  test('get with `offset` and `length` options', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123456789'), function (err) {
      t.error(err)
      store.get(0, { offset: 2, length: 3 }, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, Buffer.from('234'))
        store.destroy(function (err) {
          t.error(err)
          t.end()
        })
      })
    })
  })

  test('get with null option', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123456789'), function (err) {
      t.error(err)
      store.get(0, null, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, Buffer.from('0123456789'))
        store.destroy(function (err) {
          t.error(err)
          t.end()
        })
      })
    })
  })

  test('get with empty object option', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123456789'), function (err) {
      t.error(err)
      store.get(0, {}, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, Buffer.from('0123456789'))
        store.destroy(function (err) {
          t.error(err)
          t.end()
        })
      })
    })
  })

  test('get with `offset` option', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123456789'), function (err) {
      t.error(err)
      store.get(0, { offset: 2 }, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, Buffer.from('23456789'))
        store.destroy(function (err) {
          t.error(err)
          t.end()
        })
      })
    })
  })

  test('get with `length` option', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123456789'), function (err) {
      t.error(err)
      store.get(0, { length: 5 }, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, Buffer.from('01234'))
        store.destroy(function (err) {
          t.error(err)
          t.end()
        })
      })
    })
  })

  test('test for sparsely populated support', function (t) {
    const store = new Store(10)
    store.put(10, Buffer.from('0123456789'), function (err) {
      t.error(err)
      store.get(10, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, Buffer.from('0123456789'))
        store.destroy(function (err) {
          t.error(err)
          t.end()
        })
      })
    })
  })

  test('test `put` without callback - error should be silent', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('01234'))
    store.destroy(function (err) {
      t.error(err)
      t.end()
    })
  })

  test('test `put` without callback - success should be silent', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123456789'))
    store.destroy(function (err) {
      t.error(err)
      t.end()
    })
  })

  test('chunkLength property', function (t) {
    const store = new Store(10)
    t.equal(store.chunkLength, 10)
    store.destroy(function (err) {
      t.error(err)
      t.end()
    })
  })

  test('test `get` on non-existent index', function (t) {
    const store = new Store(10)
    store.get(0, function (err, chunk) {
      t.ok(err instanceof Error)
      store.destroy(function (err) {
        t.error(err)
        t.end()
      })
    })
  })

  test('test empty store\'s `close` calls its callback', function (t) {
    const store = new Store(10)
    store.close(function (err) {
      t.error(err)
      t.end()
    })
  })

  test('test non-empty store\'s `close` calls its callback', function (t) {
    const store = new Store(10)
    store.put(0, Buffer.from('0123456789'))
    store.close(function (err) {
      t.error(err)
      t.end()
    })
  })
}
