const {HTMLNode} = require("../../parser/HTMLNode");
const {File} = require("../../parser/File");
const path = require('path');
const {collectAndUpdateNodeSourceLink} = require('./collect-and-update-node-source-link');

describe('collectAndUpdateNodeSourceLink', () => {
  it('should return null if node tag does not match any expected tag', () => {
    const node = (new HTMLNode('<p>some paragraph</p>')).childNodes()[0];
    const file = new File(path.join(__dirname, 'test.html'), __dirname)
    
    expect(collectAndUpdateNodeSourceLink(node, file, {})).toEqual(null)
  });
  
  it('should update node and return src details', () => {
    const node = (new HTMLNode('<link href="../file.css" rel="stylesheet">')).childNodes()[0];
    const file = new File(path.join(__dirname, 'test.html'), __dirname);
    const resources = {};
  
    expect(node.attributes.href).toEqual('../file.css')
    
    const res = collectAndUpdateNodeSourceLink(node, file, resources, __dirname);
  
    expect(res.srcDestPath).toMatch(/stylesheets\/file-[a-zA-Z0-9]{8}.css/)
    expect(res.pageFile).toEqual(file)
    expect(res.srcPath).toEqual(expect.stringContaining('/core/builder/file.css'))
    expect(node.attributes.href).toMatch(/stylesheets\/file-[a-zA-Z0-9]{8}.css/)
    expect(Object.values(resources)).toEqual(expect.arrayContaining([
      {
        hash: expect.stringMatching(/[a-zA-Z0-9]{8}/),
        path: expect.stringContaining('/core/builder/file.css'),
      }
    ]))
  });
  
  it('should handle path to node modules', () => {
    const node = (new HTMLNode('<link href="../../node_modules/mod/file.css" rel="stylesheet">')).childNodes()[0];
    const file = new File(path.join(__dirname, 'test.html'), __dirname);
    const resources = {};
  
    expect(node.attributes.href).toEqual('../../node_modules/mod/file.css')
  
    const res = collectAndUpdateNodeSourceLink(node, file, resources, __dirname);
  
    expect(res.srcDestPath).toMatch(/stylesheets\/file-[a-zA-Z0-9]{8}.css/)
    expect(res.pageFile).toEqual(file)
    expect(res.srcPath).toEqual(expect.stringContaining('/node_modules/mod/file.css'))
    expect(node.attributes.href).toMatch(/stylesheets\/file-[a-zA-Z0-9]{8}.css/)
    expect(Object.values(resources)).toEqual(expect.arrayContaining([
      {
        hash: expect.stringMatching(/[a-zA-Z0-9]{8}/),
        path: expect.stringContaining('/node_modules/mod/file.css'),
      }
    ]))
  });
});
