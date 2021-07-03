const {transform} = require("../../transform");
const {File} = require("../../File");
const {collectAndUpdateNodeSourceLink} = require('./collect-and-update-node-source-link');
const path = require('path');

function processPage(pagePath, fileName, resources, opt) {
  const linkedSources = [];
  const file = new File(pagePath, opt.srcDir);
  const fileExportName = pagePath.replace(path.basename(pagePath), fileName);
  
  const content = transform(file.toString(), {
    file,
    data: opt.staticData,
    context: opt.contextData,
    customTags: opt.customTags,
    customAttributes: opt.customAttributes,
    partialFiles: opt.partials,
    env: opt.env,
    onBeforeRender: (node, nodeFile) => {
      const src = collectAndUpdateNodeSourceLink(node, nodeFile, resources);
      
      if (src) {
        linkedSources.push(src);
      }
    }
  });
  
  return {
    content,
    linkedSources,
    file: new File(fileExportName, opt.srcDir)
  };
}

module.exports.processPage = processPage;