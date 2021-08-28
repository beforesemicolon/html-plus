const {createHash} = require('crypto');
const {mkdir, rmdir, writeFile, readFile, unlink} = require('fs/promises');
const path = require('path');

/**
 * handles content and file caching
 */
class CacheService {
  #cacheDir = path.resolve(process.cwd(), '.hp-cache');
  #memCache = new Map();
  #cacheFiles = new Set();
  
  /**
   * first makes sure the cache file directory is cleared and created empty
   * @returns {Promise<void>}
   */
  async init() {
    await rmdir(this.cacheDir, {recursive: true});
    await mkdir(this.cacheDir);
  }
  
  /**
   * sha256 hash any string
   * @param content
   * @returns {string}
   */
  hashString(content) {
    const hash = createHash('sha256');
    hash.write(content)
    return hash.digest('hex');
  }
  
  get cacheDir() {
    return this.#cacheDir;
  }
  
  /**
   * caches a file content by saving in a hashed file name file with the same extension
   * which makes it unique based on the file path and always the same as long
   * as the file is of same path
   * @param filePath
   * @param content
   * @returns {Promise<void>}
   */
  async cacheFile(filePath, content) {
    const hashedFilePath = this.hashString(filePath);
    
    await writeFile(path.join(this.cacheDir, `${hashedFilePath}${path.extname(filePath)}`), content, 'utf-8');
    
    this.#cacheFiles.add(filePath);
  }
  
  async getCachedFile(filePath) {
    if (this.hasCachedFile(filePath)) {
      const hashedFilePath = this.hashString(filePath);
      return readFile(path.join(this.cacheDir, `${hashedFilePath}${path.extname(filePath)}`), 'utf-8');
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
  
  /**
   * memory caches key-value pair data
   * @param key
   * @param value
   */
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
