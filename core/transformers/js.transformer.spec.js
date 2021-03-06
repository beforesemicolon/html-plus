const {jsTransformer} = require('./js.transformer');
const {File} = require('../parser/File');
const path = require('path');
const data = require('./test-data');
const {writeFile, mkdir, rmdir} = require('../utils/fs-promise');

describe('jsTransformer', () => {
  const src = path.resolve(__dirname, '__src-js');
  
  beforeAll(async () => {
    await mkdir(src);
    await writeFile(path.join(src, 'app.js'), data.js);
    await writeFile(path.join(src, 'app.ts'), data.ts);
    await writeFile(path.join(src, 'app.jsx'), data.react);
  });
  
  afterAll(async () => {
    await rmdir(src, {recursive: true});
  });
  
  describe('should transform from content', () => {
    it('and keep browser API code intact', async() => {
      await expect(jsTransformer('document.getElementById("sample")'))
        .resolves.toEqual("document.getElementById(\"sample\");\n");
      await expect(jsTransformer('const wk = new Worker("worker.js")'))
        .resolves.toEqual("const wk = new Worker(\"worker.js\");\n");
      await expect(jsTransformer('import md from "./app.mjs"'))
        .resolves.toEqual("import md from \"./app.mjs\";\n");
    });
    
    it('and transform ts code', async () => {
      await expect(jsTransformer(`
        type name = string;
        let x: name;
        x = 'sample';
        `, {loader: 'ts'}))
        .resolves.toEqual("let x;\nx = \"sample\";\n");
      await expect(jsTransformer(`
        class Test {
          private _priv: number = 10;
          
          get priv(): number {
            return this._priv;
          }
        }
        `, {loader: 'ts'}))
        .resolves.toEqual("class Test {\n  constructor() {\n    this._priv = 10;\n  }\n  get priv() {\n    return this._priv;\n  }\n}\n");
    });
  
    it('and transform ts code with custom tsconfig', async () => {
      await expect(jsTransformer(`
        // some comment
        let x: any;
        x = 'sample';
        `, {loader: 'ts', tsConfig: {
          compilerOptions: {
            noImplicitAny: true,
            removeComments: false,
          }
        }}))
        .resolves.toEqual("let x;\nx = \"sample\";\n");
    });
  
    it('and minify', async () => {
      await expect(jsTransformer(`
        type name = string;
        let x: name;
        x = 'sample';
        `, {loader: 'ts', env: 'production'}))
        .resolves.toEqual("let x;x=\"sample\";\n");
      await expect(jsTransformer(`
        class Test {
          private _priv: number = 10;

          get priv(): number {
            return this._priv;
          }
        }
        `, {loader: 'ts', env: 'production'}))
        .resolves.toEqual("class Test{constructor(){this._priv=10}get priv(){return this._priv}}\n");
    });
    
    it('and define env variables', async () => {
      await expect(jsTransformer('const y = x;', {
        envVariables: {x: 10}
      }))
        .resolves.toEqual("const y = 10;\n");
    });
  });

  describe('should transform from file', () => {
    it('js code', () => {
      expect.assertions(1);

      const file = new File(path.join(src, 'app.js'));

      return jsTransformer({file})
        .then(res => {
          expect(res.content.replace(/\s+/g, ''))
            .toEqual(data.jsFileResult.replace(/\s+/g, ''));
        })
    });

    it('ts code', () => {
      expect.assertions(1);

      const file = new File(path.join(src, 'app.ts'));

      return jsTransformer({file})
        .then(res => {
          expect(res.content.replace(/\s+/g, ''))
            .toEqual(data.tsFileResult.replace(/\s+/g, ''));
        });
    });

    it('react(jsx) code', () => {
      expect.assertions(1);

      const file = new File(path.join(src, 'app.jsx'));

      return jsTransformer({file, excludeModules: ['react']})
        .then(res => {
          expect(res.content.replace(/\s+/g, ''))
            .toEqual(data.reactResult.replace(/\s+/g, ''));
        });
    });
  });
  
  it('should throw error if no file provided', () => {
    return expect(jsTransformer({})).rejects.toThrowError('If no string content is provided, the "file" option must be provided.')
  });
  
})
