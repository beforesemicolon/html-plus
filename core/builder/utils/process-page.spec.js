const {processPage} = require('./process-page');
const {File} = require('../../parser/File');
const path = require('path');
const {writeFile, rm} = require('fs/promises');

describe('processPage', () => {
  const options = {
    staticData: {},
    contextData: {},
    customTags: [],
    customAttributes: [],
    customTagStyles: {},
    partials: [],
    env: 'production',
    srcDir: __dirname,
  };
  
  const home = path.join(__dirname, 'index.html');
  
  beforeEach(async () => {
    await writeFile(home, '<link href="./app.css">')
  })
  
  afterEach(async () => {
    await rm(home)
  })
  
  it('should process', async () => {
    const resources = {};
    const res = await processPage(
      path.join(__dirname, 'index.html'),
      'app.html',
      resources,
      options
    )
    
    expect(resources).toEqual(expect.objectContaining({
      [path.join(__dirname, 'app.css')]: expect.objectContaining({
        hash: expect.any(String),
        path: path.join(__dirname, 'app.css')
      })
    }))
    expect(res.content).toMatch(/<link href=".\/stylesheets\/app-[a-zA-Z0-9]{8}.css"\/>/)
    expect(res.file).toEqual(expect.any(File))
    expect(res.linkedSources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        pageFile: expect.any(File),
        srcDestPath: expect.stringMatching('stylesheets\\/app-[a-zA-Z0-9]{8}.css'),
        srcPath: expect.stringContaining('/html-plus/core/builder/utils/app.css')
      })
    ]))
  });
});
