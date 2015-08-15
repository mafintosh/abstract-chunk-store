# abstract-chunk-store

A test suite and interface you can use to implement a chunk based storage backend

```
npm install abstract-chunk-store
```

## Some modules that use this

- [memory-chunk-store](https://npmjs.com/package/memory-chunk-store)
- [fs-chunk-store](https://npmjs.com/package/fs-chunk-store)
- [immediate-chunk-store](https://npmjs.com/package/immediate-chunk-store)
- [cache-chunk-store](https://npmjs.com/package/cache-chunk-store)

Send a PR adding yours if you write a new one

## API

#### `chunkStore = new ChunkStore(chunkLength)`

Create a new chunk store. Chunks must have a length of `chunkLength`.

#### `chunkStore.put(index, chunkBuffer, [cb])`

Add a new chunk to the storage. Index should be an integer.

#### `chunkStore.get(index, [options], cb)`

Retrieve a chunk stored. Index should be an integer.
Options include:

``` js
{
  offset: chunkByteOffset,
  length: byteLength
}
```

If the index doesn't exist in the storage an error should be returned.

#### `chunkStore.close([cb])`

Close the underlying resource, e.g. if the store is backed by a file, this would close the
file descriptor.

#### `chunkStore.destroy([cb])`

Destroy the file data, e.g. if the store is backed by a file, this would delete the file
from the filesystem.

## Test Suite

Publishing a test suite as a module lets multiple modules all ensure compatibility since
they use the same test suite.

To use the test suite from this module you can `require('abstract-chunk-store/tests')`.

An example of this can be found in the
[memory-chunk-store](https://github.com/mafintosh/memory-chunk-store/blob/master/test.js)
test suite.

To run the tests simply pass your test module (`tap` or `tape` or any other compatible
modules are supported) and your store's constructor (or a setup function) in:

```js
var tests = require('abstract-chunk-store/tests')
tests(require('tape'), require('your-custom-chunk-store'))
```

## License

MIT
