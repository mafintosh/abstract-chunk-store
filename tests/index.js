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
    var tasks = []
    for (var i = 0; i < 100; i++) {
      tasks.push(function (cb) {
        var chunkNumber = i
        store.put(chunkNumber, new Buffer('chunk ' + chunkNumber), cb)
      })
    }
    parallel(tasks, function (err) {
      t.error(err)

      tasks = []
      for (var i = 0; i < 100; i++) {
        tasks.push(function (cb) {
          var chunkNumber = i
          store.get(chunkNumber, function (err, data) {
            if (err) return cb(err)
            t.deepEqual(data, new Buffer('chunk ' + chunkNumber))
            cb(null)
          })
        })
      }
      parallel(tasks, function (err) {
        t.error(err)
        t.end()
      })
    })
  })
}
