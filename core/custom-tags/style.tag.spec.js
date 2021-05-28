const {Style} = require('./style.tag');
const {transform} = require('../transform');
const data = require('../../transformers/test-data');

describe('Style', () => {
  describe('should process', () => {
    it('css style', async () => {
      const style = new Style({
        innerHTML: data.css,
        attributes: {}
      });
      
      const res1 = await style.render();
      const res2 = await transform(`<style>${data.css}</style>`);
      
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<style>${data.cssResult}</style>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<style>${data.cssResult}</style>`.replace(/\s+/g, ''))
    });
    
    it('scss style', async () => {
      const style = new Style({
        innerHTML: data.scss,
        attributes: {
          compiler: 'scss'
        }
      });
  
      const res1 = await style.render();
      const res2 = await transform(`<style #compiler="scss">${data.scss}</style>`);
  
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<style>${data.scssResult}</style>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<style>${data.scssResult}</style>`.replace(/\s+/g, ''))
    });
    
    it('sass style', async () => {
      const fileObject = {ext: '.sass'}
      const style = new Style({
        innerHTML: data.sass,
        attributes: {
          compiler: 'sass'
        },
        fileObject
      });
  
      const res1 = await style.render();
      const res2 = await transform(`<style #compiler="sass">${data.sass}</style>`, {fileObject});
  
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<style>${data.sassResult}</style>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<style>${data.sassResult}</style>`.replace(/\s+/g, ''))
    });
    
    it('less style', async () => {
      const style = new Style({
        innerHTML: data.less,
        attributes: {
          compiler: 'less'
        }
      });
  
      const res1 = await style.render();
      const res2 = await transform(`<style #compiler="less">${data.less}</style>`);
  
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<style>${data.lessResult}</style>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<style>${data.lessResult}</style>`.replace(/\s+/g, ''))
    });
    
    it('styl style', async () => {
      const style = new Style({
        innerHTML: data.stylus,
        attributes: {
          compiler: 'styl'
        }
      });
  
      const res1 = await style.render();
      const res2 = await transform(`<style #compiler="styl">${data.stylus}</style>`);
  
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<style>${data.stylusResult}</style>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<style>${data.stylusResult}</style>`.replace(/\s+/g, ''))
    });
  });
  
  describe('should throw error', () => {
    it('if use wrong compiler', async () => {
      await expect(transform(`<style #compiler="scss">${data.css}</style>`)).rejects.toThrowError()
      await expect(transform(`<style #compiler="scss">${data.sass}</style>`)).rejects.toThrowError()
      await expect(transform(`<style #compiler="less">${data.scss}</style>`)).rejects.toThrowError()
      await expect(transform(`<style #compiler="styl">${data.scss}</style>`)).rejects.toThrowError()
    });
  });
});