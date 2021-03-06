const {cssTransformer} = require('./css.transformer');
const path = require('path');
const {File} = require('../parser/File');
const data = require('./test-data');
const {writeFile, unlink} = require('../utils/fs-promise');

describe('cssTransformer', () => {
  describe('should transform from file', () => {
    const cssFile = path.resolve(__dirname, '__style.css');
    const css2File = path.resolve(__dirname, '__box.css');
    const htmlFile = path.resolve(__dirname, '__index.html');
    let file = null;
    
    beforeAll(async () => {
      await writeFile(cssFile, data.css.trim());
      await writeFile(css2File, '* {box-sizing: border-box;}');
      await writeFile(htmlFile, '<html><head><link rel="stylesheet" href="__style.css"></head><body><div class="image"></div></body></html>');
      file = new File(cssFile, __dirname);
    })
    
    afterAll(async () => {
      await unlink(cssFile);
      await unlink(css2File);
      await unlink(htmlFile);
    });
    
    it('from string', () => {
      return cssTransformer(data.css).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.cssResult.replace(/\s/g, ''));
      })
    });
    
    it('from file', () => {
      return cssTransformer(data.css, {file}).then(res => {
        expect(res.content.replace(/\s/g, '')).toEqual(data.cssResult.replace(/\s/g, ''));
      })
    });
  
    it('should setup for production minified, purged with image resolved', () => {
      expect.assertions(3);
    
      return cssTransformer(data.css, {
        env: 'production',
        file,
        assetsPath: './files'
      }).then(res => {
        expect(res.content).toEqual(expect.stringContaining(':root{--mainColor:rgba(18,52,86,0.47059)}body{color:rgba(18,52,86,.47059);color:var(--mainColor);font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;word-wrap:break-word}'));
        expect(res.linkedResources.length).toBe(2)
        expect(res.linkedResources).toEqual(expect.arrayContaining([
          expect.stringContaining('/core/transformers/image@1x.png'),
          expect.stringContaining('/core/transformers/image@2x.png'),
        ]));
      })
    });
  
    it('should import', () => {
      return cssTransformer('@import "./__box.css";', {file}).then(res => {
        expect(res.content).toEqual('* {box-sizing: border-box;}');
      })
    });
  
    it('should take options as first arg', () => {
      return cssTransformer({file}).then(res => {
        expect(res.content.replace(/\s/g, '')).toEqual(data.cssResult.replace(/\s/g, ''));
      })
    });
  });
  
  it('should return empty string if no content provided', () => {
    expect.assertions(1);
    
    return cssTransformer().then(res => {
      expect(res).toEqual('');
    })
  });
  
  it('should throw error if no file provided', () => {
    return expect(cssTransformer({})).rejects.toThrowError('If no string content is provided, the "file" option must be provided.')
  });
});
