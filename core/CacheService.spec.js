const {cacheService} = require('./CacheService');
const path = require('path');

describe('CacheService', () => {
  it('should get cache dir', () => {
    expect(cacheService.cacheDir).toBe(path.join(process.cwd(), '.hp-cache'))
  });
  
  describe('memory cache', () => {
    beforeAll(() => {
      cacheService.cache('x', 10);
    })
    
    it('should cache', () => {
      expect(cacheService.hasCachedValue('x')).toBeTruthy();
    });
    
    it('should get cached value', () => {
      expect(cacheService.getCachedValue('x')).toEqual(10);
    });
    
    it('should remove cached value', () => {
      cacheService.removeCachedValue('x')
  
      expect(cacheService.hasCachedValue('x')).toBeFalsy();
    });
  });
  
  describe('file cache', () => {
    const testCacheFile = path.join(__dirname, 'cache-test.html');
    
    beforeAll(async () => {
      await cacheService.cacheFile(testCacheFile, 'some content');
    })
  
    it('should cache', () => {
      expect(cacheService.hasCachedFile(testCacheFile)).toBeTruthy();
    });
  
    it('should get cached value', () => {
      return expect(cacheService.getCachedFile(testCacheFile)).resolves.toEqual('some content');
    });
  
    it('should remove cached value', async () => {
      await cacheService.removeCachedFile(testCacheFile)
  
      expect(cacheService.hasCachedFile(testCacheFile)).toBeFalsy();
    });
  });
});
