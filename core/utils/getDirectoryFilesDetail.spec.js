const {getDirectoryFilesDetail} = require('./getDirectoryFilesDetail');
const path = require('path');

describe('getDirectoryFilesDetail', () => {
  const dir = path.resolve(__dirname);
  
  describe('should read all the test files in this directory', () => {
    it('with extension', () => {
      expect.assertions(3);
    
      return getDirectoryFilesDetail(dir, 'spec.js')
        .then(dirs => {
          expect(dirs.length > 0).toBe(true);
          expect(dirs[0]).toEqual(expect.objectContaining({
            ext: '.js',
            item: expect.any(String),
            itemPath: expect.any(String),
          }));
          expect(dirs.every(obj => obj.item.endsWith('.spec.js'))).toBe(true);
        });
    });
  
    it('with callback function', () => {
      expect.assertions(3);
    
      return getDirectoryFilesDetail(dir, filePath => filePath.endsWith('spec.js'))
        .then(dirs => {
          expect(dirs.length > 0).toBe(true);
          expect(dirs[0]).toEqual(expect.objectContaining({
            ext: '.js',
            item: expect.any(String),
            itemPath: expect.any(String),
          }));
          expect(dirs.every(obj => obj.item.endsWith('.spec.js'))).toBe(true);
        });
    });
  });
  
  it('should fail to read dir', () => {
    return expect(getDirectoryFilesDetail('/some/non/existing/dir/path', 'spec.js'))
      .rejects.toThrow('ENOENT: no such file or directory, scandir \'/some/non/existing/dir/path\'')
  });
});