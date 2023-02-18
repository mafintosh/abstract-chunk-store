declare module 'abstract-chunk-store' {
  type GetCallback = (err: Error | null, buffer: Buffer) => void

  export interface ChunkStore {
    /**
     * Create a new chunk store. Chunks must have a length of `chunkLength`.
     */
    constructor(chunkLength: number)

    /**
     * Add a new chunk to the storage. `index` should be an integer.
     */
    put(
      index: number,
      chunkBuffer: Buffer,
      cb: (err: Error | null) => void
    ): void

    /**
     * Retrieve a chunk stored. `index` should be an integer.
     */
    get(index: number, cb: GetCallback): void
    get(
      index: number,
      options: { offset?: number; length?: number },
      cb: GetCallback
    ): void

    /**
     * Close the underlying resource, e.g. if the store is backed by a file, this would close the file descriptor.
     */
    close(cb: (err: Error | null) => void)

    /**
     * Destroy the file data, e.g. if the store is backed by a file, this would delete the file from the filesystem.
     */
    destroy(cb: (err: Error | null) => void)

    /**
     * Expose the chunk length from the constructor so that code that receives a chunk store can know what size of chunks to write.
     */
    chunkLength: number
  }
}
