const {sassTransformer} = require('./sass.transformer');
const {File} = require('../parser/File');
const path = require('path');
const data = require('./test-data');
const {writeFile, unlink} = require('fs/promises');

describe('sassTransformer', () => {
  describe('should transform ', () => {
    const cssFile = `${path.resolve(__dirname)}/__style.scss`;
  
    beforeAll(async () => {
      await writeFile(cssFile, data.scss);
    })
  
    afterAll(async () => {
      await unlink(cssFile);
    });
  
    it('from scss string', () => {
      expect.assertions(1);
      
      return sassTransformer(data.scss).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.scssResult.replace(/\s/g, ''));
      })
    });
  
    it('from sass string', () => {
      expect.assertions(1);
    
      return sassTransformer(data.sass, {file: {ext: '.sass'}}).then(res => {
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
      return sassTransformer('@import "./style2";', {file: new File(file1)}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(baseStyle);
      })
    });
  
    it('at above directory ', () => {
      return sassTransformer('@import "../style3";', {file: new File(file1)}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(baseStyle);
      })
    });
  });
  
  it('should throw error if no file provided', () => {
    return expect(sassTransformer({})).rejects.toThrowError('If no string content is provided, the "file" option must be provided.')
  });
  
  describe('should work with other options', () => {
    it('indentWidth', () => {
      return sassTransformer(`
      body {
          background: #edd;
      }
      `, {
        indentWidth: 8
      }).then(res => {
        expect(res).toEqual('body {\n' +
          '        background: #edd; }\n');
      })
    });
  
    it('precision', () => {
      return sassTransformer(`
      $w: (10 / 3);
      body {
          width: #{$w}px;
      }
      `, {
        precision: 5
      }).then(res => {
        expect(res).toEqual('body {\n' +
          '  width: 3.33333px; }\n');
      })
    });
  
    it('indentType', () => {
      return sassTransformer(`
      body {
          width: 300px;
      }
      `, {
        indentWidth: 1,
        indentType: 'tab'
      }).then(res => {
        expect(res).toEqual('body {\n' +
          '\twidth: 300px; }\n');
      })
    });
  
    it('sourceComments', () => {
      return sassTransformer(`
      body {
          width: 300px;
      }
      `, {
        sourceComments: true
      }).then(res => {
        expect(res).toEqual('/* line 2, stdin */\n' +
          'body {\n' +
          '  width: 300px; }\n');
      })
    });
  });
  
});
