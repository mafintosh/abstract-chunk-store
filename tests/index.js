var parallel = require('run-parallel')

module.exports = function (test, Store) {
  test('basic put, then get', function (t) {
    var store = new Store()
    store.put(0, new Buffer('first chunk'), function (err) {
      t.error(err)
      store.get(0, function (err, chunk) {
        t.error()
        t.deepEqual(chunk, new Buffer('first chunk'))
        t.end()
      })
    })
  })

  test('concurrent puts, then concurrent gets', function (t) {
    var store = new Store()

    function makePutTask (i) {
      return function (cb) {
        store.put(i, new Buffer('chunk ' + i), cb)
      }
    }

    function makeGetTask (i) {
      return function (cb) {
        store.get(i, function (err, data) {
          if (err) return cb(err)
          t.deepEqual(data, new Buffer('chunk ' + i))
          cb(null)
        })
      }
    }

    var tasks = []
    for (var i = 0; i < 100; i++) {
      tasks.push(makePutTask(i))
    }

    parallel(tasks, function (err) {
      t.error(err)

      tasks = []
      for (var i = 0; i < 100; i++) {
        tasks.push(makeGetTask(i))
      }

      parallel(tasks, function (err) {
        t.error(err)
        t.end()
      })
    })
  })

  test('get non-existant chunk', function (t) {
    t.plan(2)
    var store = new Store()
    store.get(0, function (err, data) {
      t.ok(err instanceof Error)
      t.notOk(data)
    })
  })

  test('interleaved puts and gets', function (t) {
    var store = new Store()
    var tasks = []

    function makeTask (i) {
      return function (cb) {
        store.put(i, new Buffer('chunk ' + i), function (err) {
          if (err) return cb(err)
          store.get(i, function (err, data) {
            t.deepEqual(data, new Buffer('chunk ' + i))
            cb(null)
          })
        })
      }
    }

    for (var i = 0; i < 100; i++) {
      tasks.push(makeTask(i))
    }

    parallel(tasks, function (err) {
      t.error(err)
      t.end()
    })
  })

  test('get with `offset` and `length` options', function (t) {
    var store = new Store()
    store.put(0, new Buffer('first chunk'), function (err) {
      t.error(err)
      store.get(0, { offset: 2, length: 3 }, function (err, chunk) {
        t.error()
        t.deepEqual(chunk, new Buffer('rst'))
        t.end()
      })
    })
  })

  test('test for sparsely populated support', function (t) {
    var store = new Store()
    store.put(10, new Buffer('this is a chunk'), function (err) {
      t.error(err)
      store.get(10, function (err, chunk) {
        t.error(err)
        t.deepEqual(chunk, new Buffer('this is a chunk'))
        t.end()
      })
    })
  })
}
