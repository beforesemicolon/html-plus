const {Element} = require("../../parser/Element");
const {File} = require("../../parser/File");
const path = require('path');
const {collectAndUpdateNodeSourceLink} = require('./collect-and-update-node-source-link');

describe('collectAndUpdateNodeSourceLink', () => {
  it('should return null if node tag does not match any expected tag', () => {
    const p = new Element('p');
    p.textContent = 'some paragraph';
    
    const file = new File(path.join(__dirname, 'test.html'), __dirname)
    
    expect(collectAndUpdateNodeSourceLink(p, file, {})).toEqual(null)
  });
  
  it('should update node and return src details', () => {
    const link = new Element('link');
    link.setAttribute('href', '../file.css');
    link.setAttribute('rel', 'stylesheet');
    
    const file = new File(path.join(__dirname, 'test.html'), __dirname);
    const resources = {};
  
    expect(link.getAttribute('href')).toEqual('../file.css')
    
    const res = collectAndUpdateNodeSourceLink(link, file, resources, __dirname);
  
    expect(res.srcDestPath).toMatch(/stylesheets\/file-[a-zA-Z0-9]{8}.css/)
    expect(res.pageFile).toEqual(file)
    expect(res.srcPath).toEqual(expect.stringContaining('/core/builder/file.css'))
    expect(link.getAttribute('href')).toMatch(/stylesheets\/file-[a-zA-Z0-9]{8}.css/)
    expect(Object.values(resources)).toEqual(expect.arrayContaining([
      {
        hash: expect.stringMatching(/[a-zA-Z0-9]{8}/),
        path: expect.stringContaining('/core/builder/file.css'),
      }
    ]))
  });
  
  it('should handle path to node modules', () => {
    const link = new Element('link');
    link.setAttribute('href', '../../node_modules/mod/file.css');
    link.setAttribute('rel', 'stylesheet');
    
    const file = new File(path.join(__dirname, 'test.html'), __dirname);
    const resources = {};
  
    expect(link.getAttribute('href')).toEqual('../../node_modules/mod/file.css')
  
    const res = collectAndUpdateNodeSourceLink(link, file, resources, __dirname);
  
    expect(res.srcDestPath).toMatch(/stylesheets\/file-[a-zA-Z0-9]{8}.css/)
    expect(res.pageFile).toEqual(file)
    expect(res.srcPath).toEqual(expect.stringContaining('/node_modules/mod/file.css'))
    expect(link.getAttribute('href')).toMatch(/stylesheets\/file-[a-zA-Z0-9]{8}.css/)
    expect(Object.values(resources)).toEqual(expect.arrayContaining([
      {
        hash: expect.stringMatching(/[a-zA-Z0-9]{8}/),
        path: expect.stringContaining('/node_modules/mod/file.css'),
      }
    ]))
  });
});
