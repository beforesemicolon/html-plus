const {Script} = require('./script.tag');
const {transform} = require('../transform');
const data = require('../transformers/test-data');

describe('Script Tag', () => {
  describe('should process', () => {
    it('js script', async () => {
      const fileObject = {ext: '.js'};
      
      const res2 = await transform(`<script>${data.js}</script>`, {fileObject});
      
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<script>${data.jsResult}</script>`.replace(/\s+/g, ''))
    });
    
    it('ts script', async () => {
      const fileObject = {ext: '.ts'};
      
      const res2 = await transform(`<script #compiler="ts">${data.ts}</script>`, {fileObject});
      
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<script>${data.tsResult}</script>`.replace(/\s+/g, ''))
    });
  });
});