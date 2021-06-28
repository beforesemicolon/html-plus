const {cssTransformer} = require('./css.transformer');
const path = require('path');
const cp = require('child_process');
const {promisify} = require('util');
const {File} = require('../File');
const data = require('./test-data');

const exec = promisify(cp.exec);

describe('cssTransformer', () => {
  describe('should transform from file', () => {
    const cssFile = path.resolve(__dirname, '__style.css');
    const css2File = path.resolve(__dirname, '__box.css');
    const htmlFile = path.resolve(__dirname, '__index.html');
    let file = null;
    
    beforeAll(async () => {
      await exec(`echo "${data.css.trim()}" > ${cssFile}`);
      await exec(`echo "* {box-sizing: border-box;}" > ${css2File}`);
      await exec(`echo "<body><div class="image"></div></body>" > ${htmlFile}`);
      file = new File(cssFile, __dirname);
    })
    
    afterAll(async () => {
      await exec(`rm ${cssFile}`);
      await exec(`rm ${css2File}`);
      await exec(`rm ${htmlFile}`);
    });
    
    it('from string', () => {
      return cssTransformer(data.css).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.cssResult.replace(/\s/g, ''));
      })
    });
    
    it('from file', () => {
      return cssTransformer(data.css, {file}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.cssResult.replace(/\s/g, ''));
      })
    });
  
    it('should setup for production minified, purged with image resolved', () => {
      expect.assertions(3);
    
      return cssTransformer(data.css, {env: 'production', file, assetsPath: './files'}).then(res => {
        expect(res).toEqual(expect.stringContaining(':root{--mainColor:rgba(18,52,86,0.47059)}body{color:rgba(18,52,86,.47059);color:var(--mainColor);font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;word-wrap:break-word}.image{background-image:url(./files/image@1x.png)}@keyframes test{to{opacity:1}}@media (-webkit-min-device-pixel-ratio:2),(min-resolution:2dppx){.image{background-image:url(./files/image@2x.png)}}'));
        expect(res).toEqual(expect.stringContaining('sourceMappingURL=data:application/json;base64,'));
        expect(res).toEqual(expect.stringContaining('.image{background-image:url(./files/image@1x.png)}'));
      })
    });
  
    it('should import', () => {
      return cssTransformer('@import "./__box.css";', {file}).then(res => {
        expect(res).toEqual('* {box-sizing: border-box;}');
      })
    });
  });
  
  it('should return empty string if no content provided', () => {
    expect.assertions(1);
    
    return cssTransformer().then(res => {
      expect(res).toEqual('');
    })
  });
});