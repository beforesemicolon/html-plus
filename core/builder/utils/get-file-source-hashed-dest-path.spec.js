const {getFileSourceHashedDestPath} = require('./get-file-source-hashed-dest-path');

describe('getFileSourceHashedDestPath', () => {
  const hash = '83ej32e5';
  
  it('should put styles into stylesheets dir', () => {
    const scssFile = './app.scss';
    const sassFile = './app.sass';
    const cssFile = './app.css';
    const lessFile = './app.less';
    const stylFile = './app.styl';
    
    expect(getFileSourceHashedDestPath(scssFile, hash)).toEqual('stylesheets/app-83ej32e5.css')
    expect(getFileSourceHashedDestPath(sassFile, hash)).toEqual('stylesheets/app-83ej32e5.css')
    expect(getFileSourceHashedDestPath(cssFile, hash)).toEqual('stylesheets/app-83ej32e5.css')
    expect(getFileSourceHashedDestPath(lessFile, hash)).toEqual('stylesheets/app-83ej32e5.css')
    expect(getFileSourceHashedDestPath(stylFile, hash)).toEqual('stylesheets/app-83ej32e5.css')
  });
  
  it('should put scripts into scripts dir', () => {
    const jsFile = './app.js';
    const tsFile = './app.ts';
    const cjsFile = './app.cjs';
    const mjsFile = './app.mjs';
    const jsxFile = './app.jsx';
    const tsxFile = './app.tsx';
  
    expect(getFileSourceHashedDestPath(jsFile, hash)).toEqual('scripts/app-83ej32e5.js')
    expect(getFileSourceHashedDestPath(tsFile, hash)).toEqual('scripts/app-83ej32e5.js')
    expect(getFileSourceHashedDestPath(cjsFile, hash)).toEqual('scripts/app-83ej32e5.js')
    expect(getFileSourceHashedDestPath(mjsFile, hash)).toEqual('scripts/app-83ej32e5.mjs')
    expect(getFileSourceHashedDestPath(jsxFile, hash)).toEqual('scripts/app-83ej32e5.js')
    expect(getFileSourceHashedDestPath(tsxFile, hash)).toEqual('scripts/app-83ej32e5.js')
  });
  
  it('should put anything else into assets dir', () => {
    const a = './logo.png';
    const b = './bg.jpeg';
    const c = './manifest.json';
    const d = './sample.txt';
    const e = './favicon.ico';
    const f = './sample.gif';
  
    expect(getFileSourceHashedDestPath(a, hash)).toEqual('assets/logo-83ej32e5.png')
    expect(getFileSourceHashedDestPath(b, hash)).toEqual('assets/bg-83ej32e5.jpeg')
    expect(getFileSourceHashedDestPath(c, hash)).toEqual('assets/manifest-83ej32e5.json')
    expect(getFileSourceHashedDestPath(d, hash)).toEqual('assets/sample-83ej32e5.txt')
    expect(getFileSourceHashedDestPath(e, hash)).toEqual('assets/favicon-83ej32e5.ico')
    expect(getFileSourceHashedDestPath(f, hash)).toEqual('assets/sample-83ej32e5.gif')
  });
});