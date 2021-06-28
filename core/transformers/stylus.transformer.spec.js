const {stylusTransformer} = require('./stylus.transformer');
const {File} = require('../File');
const path = require('path');
const cp = require('child_process');
const {promisify} = require('util');
const data = require('./test-data');

const exec = promisify(cp.exec);

describe('stylusTransformer', () => {
  
  describe('should transform', () => {
    const cssFile = `${path.resolve(__dirname)}/__style.styl`;
    
    beforeAll(async () => {
      await exec(`echo '${data.stylus}' >> ${cssFile}`);
    })
  
    afterAll(async () => {
      await exec(`rm ${cssFile}`);
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
      await exec(`touch ${file1}`);
      await exec(`echo '${baseStyle}' >> ${file2}`);
      await exec(`echo '${baseStyle}' >> ${file3}`);
    })
    
    afterAll(async () => {
      await exec(`rm ${file1}`);
      await exec(`rm ${file2}`);
      await exec(`rm ${file3}`);
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
});