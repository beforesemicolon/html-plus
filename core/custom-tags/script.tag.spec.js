const {Script} = require('./script.tag');
const {transform} = require('../transform');
const data = require('../transformers/test-data');

describe('Script', () => {
  describe('should process', () => {
    it('js script', async () => {
      const fileObject = {ext: '.js'};
      
      const script = new Script({
        innerHTML: data.js,
        attributes: {},
        fileObject
      });
  
      const res1 = await script.render();
      const res2 = await transform(`<script>${data.js}</script>`, {fileObject});
  
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<script>${data.jsResult}</script>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<script>${data.jsResult}</script>`.replace(/\s+/g, ''))
    });
    
    it('ts script', async () => {
      const fileObject = {ext: '.ts'};
      
      const script = new Script({
        innerHTML: data.ts,
        attributes: {
          compiler: 'ts'
        },
        fileObject
      });
  
      const res1 = await script.render();
      const res2 = await transform(`<script #compiler="ts">${data.ts}</script>`, {fileObject});
  
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<script>${data.tsResult}</script>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<script>${data.tsResult}</script>`.replace(/\s+/g, ''))
    });
  });
});