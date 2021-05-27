const {Script} = require('./script.tag');
const {transform} = require('../transform');

describe('Script', () => {
  describe('should process', () => {
    it('js script', async () => {
      const file = {ext: '.js'};
      const js = `
      class Home {
        #test = 10;
      
        constructor() {}
        
        get n() { return 10; }
      }
      `;
      const jsResult = `
      var _test;
      class Home {
        constructor() {
          _test.set(this, 10);
        }
        get n() {
          return 10;
        }
      }
      _test = new WeakMap();
      `
      const script = new Script({
        innerHTML: js,
        attributes: {},
        file
      });
  
      const res1 = await script.render();
      const res2 = await transform(`<script>${js}</script>`, {fileObject: file});
  
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<script>${jsResult}</script>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<script>${jsResult}</script>`.replace(/\s+/g, ''))
    });
    
    it('ts script', async () => {
      const file = {ext: '.ts'};
      const ts = `
      class Home {
        private test = 10;
      
        constructor() {}
        
        get n(): number { return 10; }
      }
      `;
      const tsResult = `
      class Home {
        constructor() {
          this.test = 10;
        }
        get n() {
          return 10;
        }
      }
      `
      const script = new Script({
        innerHTML: ts,
        attributes: {
          compiler: 'ts'
        },
        file
      });
  
      const res1 = await script.render();
      const res2 = await transform(`<script #compiler="ts">${ts}</script>`, {fileObject: file});
  
      expect(res1.replace(/\s+/g, ''))
        .toEqual(`<script>${tsResult}</script>`.replace(/\s+/g, ''))
      expect(res2.replace(/\s+/g, ''))
        .toEqual(`<script>${tsResult}</script>`.replace(/\s+/g, ''))
    });
  });
});