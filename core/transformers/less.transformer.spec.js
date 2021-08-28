const {lessTransformer} = require('./less.transformer');
const {File} = require('../parser/File');
const path = require('path');
const data = require('./test-data');
const {writeFile, unlink} = require('fs/promises');

describe('lessTransformer', () => {
  
  describe('should transform', () => {
    const cssFile = `${path.resolve(__dirname)}/__style.less`;
    
    beforeAll(async () => {
      await writeFile(cssFile, data.less)
    })
    
    afterAll(async () => {
      await unlink(cssFile);
    });
    
    it('from string', () => {
      expect.assertions(1);
      
      return lessTransformer(data.less).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.lessResult.replace(/\s/g, ''));
      })
    });
    
    it('from import', () => {
      expect.assertions(1);
      
      return lessTransformer(`@import '${cssFile}';`).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(data.lessResult.replace(/\s/g, ''));
      })
    });
  });
  
  it('should setup for production', () => {
    expect.assertions(1);
    
    return lessTransformer(data.less, {env: 'production'}).then(res => {
      expect(res.replace(/\s/g, '')).toEqual('a,.link{color:#428bca;}a:hover{color:#3071a9;}.widget{color:#fff;background:#428bca;}.banner{font-weight:bold;line-height:40px;margin:0auto;}.lazy-eval{width:9%;}.widget{color:#efefef;background-color:#efefef;}.button-ok{background-image:url("ok.png");}.button-cancel{background-image:url("cancel.png");}.button-custom{background-image:url("custom.png");}.link+.link{color:red;}.link.link{color:green;}.link.link{color:blue;}.link,.linkish{color:cyan;}.header.menu{border-radius:5px;}.no-borderradius.header.menu{background-image:url("images/button-background.png");}navul{background:blue;}.inline,navul{color:red;}.myclass{box-shadow:inset0010px#555,0020pxblack;}.a,#b{color:red;}.mixin-class{color:red;}.mixin-id{color:red;}.button{-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;}button{color:white;}');
    })
  });
  
  describe('should import partial', () => {
    const baseStyle = 'body{font-size: 16px;}'.replace(/\s/g, '');
    const file1 = `${path.resolve(__dirname)}/style1.less`;
    const file2 = `${path.resolve(__dirname)}/style2.less`;
    const file3 = `${path.resolve(__dirname, `../style3.less`)}`;
    
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
      return lessTransformer('@import "./style2";', {file: new File(file1)}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(baseStyle);
      })
    });
    
    it('at above directory ', () => {
      return lessTransformer('@import "../style3";', {file: new File(file1)}).then(res => {
        expect(res.replace(/\s/g, '')).toEqual(baseStyle);
      })
    });
  });
  
  it('should throw error if no file provided', () => {
    return expect(lessTransformer({})).rejects.toThrowError('If no string content is provided, the "file" option must be provided.')
  });
});
