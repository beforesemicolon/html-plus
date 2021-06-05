const {sassTransformer} = require('./sass.transformer');
const {File} = require('../File');
const path = require('path');
const cp = require('child_process');
const {promisify} = require('util');
const data = require('./test-data');

const exec = promisify(cp.exec);

describe('sassTransformer', () => {
  describe('should transform ', () => {
    const cssFile = `${path.resolve(__dirname)}/__style.scss`;
  
    beforeAll(async () => {
      await exec(`echo '${data.scss}' >> ${cssFile}`);
    })
  
    afterAll(async () => {
      await exec(`rm ${cssFile}`);
    });
  
    it('from scss string', () => {
      expect.assertions(1);
      
      return sassTransformer(data.scss).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.scssResult.replace(/\s/g, ''));
      })
    });
  
    it('from sass string', () => {
      expect.assertions(1);
    
      return sassTransformer(data.sass, {fileObject: {ext: '.sass'}}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.sassResult.replace(/\s/g, ''));
      })
    });
  
    it('from import', () => {
      expect.assertions(1);
    
      return sassTransformer(`@import '${cssFile}';`).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.scssResult.replace(/\s/g, ''));
      })
    });
  });
  
  it('should setup for production', () => {
    expect.assertions(1);
  
    return sassTransformer(data.scss, {env: 'production'}).then(res => {
      expect(res).toEqual('body{font:100% Helvetica,sans-serif;color:#333}nav ul{margin:0;padding:0;list-style:none}nav li{display:inline-block}nav a{display:block;padding:6px 12px;text-decoration:none}.icon-mail{background-image:url("/icons/mail.svg");position:absolute;top:0;left:0}.message{border:1px solid #ccc;padding:10px;color:#333}article[role="main"]{float:left;width:62.5%}.sidebar{float:left;margin-left:64px}\n');
    })
  });
  
  describe('should import partial', () => {
    const baseStyle = 'body{font-size: 16px;}'.replace(/\s/g, '');
    const file1 = `${path.resolve(__dirname)}/style1.scss`;
    const file2 = `${path.resolve(__dirname)}/style2.scss`;
    const file3 = `${path.resolve(__dirname, `../style3.scss`)}`;
  
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
      return sassTransformer('@import "./style2";', {fileObject: new File(file1)}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(baseStyle);
      })
    });
  
    it('at above directory ', () => {
      return sassTransformer('@import "../style3";', {fileObject: new File(file1)}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(baseStyle);
      })
    });
  });
  
});