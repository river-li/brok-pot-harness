var WorkerBlobStore = class {
  constructor(pool, agentId, blobDbPath, legacyBlobDbPath) {
    this.pool = pool;
    this.agentId = agentId;
    this.blobDbPath = blobDbPath;
    this.legacyBlobDbPath = legacyBlobDbPath;
  }
  pool;
  agentId;
  blobDbPath;
  legacyBlobDbPath;
  async getBlob(_ctx, blobId) {
    return this.pool.getBlob(this.agentId, this.blobDbPath, blobId, this.legacyBlobDbPath);
  }
  async setBlob(_ctx, blobId, blobData) {
    await this.pool.setBlob(this.agentId, this.blobDbPath, blobId, blobData, this.legacyBlobDbPath);
  }
  async setBlobLocallyOnly(ctx, blobId, blobData) {
    await this.setBlob(ctx, blobId, blobData);
  }
  async flush(_ctx) {
  }
};
