# abstract-chunk-store

A test suite and interface you can use to implement a chunk based storage backend

```
npm install abstract-chunk-store
```

## API

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

If the index doesn't exist in the storage an error should
be returned

## License

MIT
