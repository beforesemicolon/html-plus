const {getDirectoryFilesDetail} = require('./getDirectoryFilesDetail');
const path = require('path');

describe('getDirectoryFilesDetail', () => {
  const dir = path.resolve(__dirname);
  
  it('should read all the test files in the directory', () => {
    expect.assertions(3);
    
    return getDirectoryFilesDetail(dir, '.spec.js')
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
  
  it.todo('should fail to get stat');
  
  it.todo('should fail to read dir');
  
});