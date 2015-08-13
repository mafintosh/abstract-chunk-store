module.exports = function (test, Store) {
  test('basic put and get', function (t) {
    t.plan(3)
    var chunks = new Store()
    chunks.put(0, new Buffer('first chunk'), function (err) {
      t.error(err)
      chunks.get(0, function (err, chunk) {
        t.error()
        t.deepEqual(chunk, new Buffer('first chunk'))
      })
    })
  })
}
