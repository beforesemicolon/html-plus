const {collectFilePaths} = require('./collect-file-paths');
const {writeFile, rm} = require('../../utils/fs-promise');
const path = require('path');
const {PartialFile} = require("../../parser/PartialFile");

describe('collectFilePaths', () => {
  let pages;
  let partials;
  let resources;
  let fn;
  
  beforeEach(() => {
    pages = [];
    partials = [];
    resources = {};
    fn = collectFilePaths(__dirname, {pages, partials, resources});
  })
  
  it('should collect page', () => {
    fn('page.html');
    fn('dir/app.html');
    
    expect(pages).toEqual(["page.html", "dir/app.html"]);
    expect(partials).toEqual([]);
    expect(resources).toEqual({});
  });
  
  describe('should collect partial', () => {
    const f1 = path.join(__dirname, '_layout.html');
    const f2 = path.join(__dirname, '_heading.html');
    
    beforeEach(async () => {
      await writeFile(f1, '')
      await writeFile(f2, '')
    })
  
    afterEach(async () => {
      await rm(f1)
      await rm(f2)
    })
    
    it('existing files', async () => {
      fn(f1)
      fn(f2)
    
      expect(pages).toEqual([]);
      expect(partials.length).toEqual(2);
      expect(partials[0]).toBeInstanceOf(PartialFile);
      expect(partials[1]).toBeInstanceOf(PartialFile);
      expect(resources).toEqual({});
    });
  
    it('throwing if file does not exists', () => {
      expect(() => fn('sample/_file.html')).toThrowError('no such file or directory')
    });
  });
  
  it('should ignore non html partials starting with underscore', () => {
    fn('_app.scss');
    fn('_normalizer.less');
  
    expect(pages).toEqual([]);
    expect(partials).toEqual([]);
    expect(resources).toEqual({});
  });
  
  it('should collect any other resource', () => {
    fn('app.js');
    fn('app.less');
  
    expect(pages).toEqual([]);
    expect(partials).toEqual([]);
    expect(resources).toEqual(expect.objectContaining({
      'app.js': expect.objectContaining({
        hash: expect.any(String),
        path: 'app.js',
      }),
      'app.less': expect.objectContaining({
        hash: expect.any(String),
        path: 'app.less',
      })
    }));
  });
  
  
});
