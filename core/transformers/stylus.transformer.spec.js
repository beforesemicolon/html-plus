const {stylusTransformer} = require('./stylus.transformer');
const {File} = require('../parser/File');
const path = require('path');
const data = require('./test-data');
const {writeFile, unlink} = require('../utils/fs-promise');

describe('stylusTransformer', () => {
  
  describe('should transform', () => {
    const cssFile = `${path.resolve(__dirname)}/__style.styl`;
    
    beforeAll(async () => {
      await writeFile(cssFile, data.stylus);
    })
  
    afterAll(async () => {
      await unlink(cssFile);
    });
    
    it('from string', () => {
      expect.assertions(1);
      
      return stylusTransformer(data.stylus).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.stylusResult.replace(/\s/g, ''));
      })
    });
    
    it('from import', () => {
      expect.assertions(1);
  
      return stylusTransformer(`@import '${cssFile}';`).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.stylusResult.replace(/\s/g, ''));
      })
    });
  });
  
  describe('should import partial', () => {
    const baseStyle = 'body{font-size: 16px;}'.replace(/\s/g, '');
    const file1 = `${path.resolve(__dirname)}/style1.styl`;
    const file2 = `${path.resolve(__dirname)}/style2.styl`;
    const file3 = `${path.resolve(__dirname, `../style3.styl`)}`;
    
    beforeAll(async () => {
      await writeFile(file1, '');
      await writeFile(file2, baseStyle);
      await writeFile(file3, baseStyle);
    })
    
    afterAll(async () => {
      await unlink(file1);
      await unlink(file2);
      await unlink(file3);
    });
    
    it('at same directory ', () => {
      return stylusTransformer('@import "./style2";', {file: new File(file1)}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(baseStyle);
      })
    });
    
    it('at above directory ', () => {
      return stylusTransformer('@import "../style3";', {file: new File(file1)}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(baseStyle);
      })
    });
  });
  
  it('should throw error if no file provided', () => {
    return expect(stylusTransformer({})).rejects.toThrowError('If no string content is provided, the "file" option must be provided.')
  });
});
