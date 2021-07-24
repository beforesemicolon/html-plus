const {createHash} = require('crypto');
const {mkdir, writeFile, readFile, unlink} = require('fs/promises');
const {existsSync} = require('fs');
const path = require('path');

class CacheService {
  #cacheDir = path.resolve(process.cwd(), '.hp-cache');
  #memCache = new Map();
  #cacheFiles = new Set();
  
  hashString(content) {
    const hash = createHash('sha256');
    hash.write(content)
    return hash.digest('hex');
  }
  
  get cacheDir() {
    return this.#cacheDir;
  }
  
  async cacheFile(filePath, content) {
    const hashedFilePath = this.hashString(filePath);
    
    if (!existsSync(this.cacheDir)) {
      await mkdir(this.cacheDir);
    }
    
    await writeFile(path.join(this.cacheDir, `${hashedFilePath}${path.extname(filePath)}`), content, 'utf-8');
    
    this.#cacheFiles.add(filePath);
  }
  
  async getCachedFile(filePath) {
    if (this.hasCachedFile(filePath)) {
      const hashedFilePath = this.hashString(filePath);
      return readFile(path.join(this.cacheDir, `${hashedFilePath}${path.extname(filePath)}`));
    }
    
    return null;
  }
  
  hasCachedFile(filePath) {
    return this.#cacheFiles.has(filePath);
  }
  
  async removeCachedFile(filePath) {
    if (this.hasCachedFile(filePath)) {
      this.#cacheFiles.delete(filePath);
      const hashedFilePath = this.hashString(filePath);
      await unlink(path.join(this.cacheDir, `${hashedFilePath}${path.extname(filePath)}`));
    }
  }
  
  cache(key, value) {
    this.#memCache.set(key, value);
  }
  
  getCachedValue(key) {
    return this.hasCachedValue ? this.#memCache.get(key) : null;
  }
  
  removeCachedValue(key) {
    this.#memCache.delete(key);
  }
  
  hasCachedValue(key) {
    return this.#memCache.has(key);
  }
}

module.exports.cacheService = new CacheService();
