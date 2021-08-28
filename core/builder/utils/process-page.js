const {render} = require("../../parser/render");
const {File} = require("../../parser/File");
const {collectAndUpdateNodeSourceLink} = require('./collect-and-update-node-source-link');
const path = require('path');
const {injectTagStylesToPage} = require("./../../engine/inject-tag-styles-to-page");
const {collectPageTagsStyle} = require("./../../engine/collect-page-tags-style");

async function processPage(pagePath, fileName, resources, opt, filePath) {
  const linkedSources = [];
  const file = new File(pagePath, opt.srcDir);
  const fileExportName = pagePath.replace(path.basename(pagePath), fileName);
  const fileDirPath = filePath
    ? path.join(opt.srcDir, filePath.replace(path.basename(filePath), ''))
    : file.fileDirectoryPath;
  const usedTagsWithStyle = new Set();
  
  let content = render({
    file,
    env: opt.env,
    content: file.toString(),
    context: {$data: opt.staticData, ...opt.contextData},
    partialFiles: opt.partials,
    onRender: (node, nodeFile) => {
      const src = collectAndUpdateNodeSourceLink(node, nodeFile, resources, fileDirPath);
  
      // collect any tag style if not already collected
      if (opt.customTagStyles[node.tagName] && !usedTagsWithStyle.has(node.tagName)) {
        usedTagsWithStyle.add(node.tagName)
      }
      
      if (src) {
        linkedSources.push(src);
      }
    }
  })
  
  // include the collected styles at the end of the head tag
  if (usedTagsWithStyle.size) {
    content = injectTagStylesToPage(content, await collectPageTagsStyle(usedTagsWithStyle, opt.customTagStyles))
  }
  
  return {
    content,
    linkedSources,
    usedTagsWithStyle,
    file: new File(fileExportName, opt.srcDir)
  };
}

module.exports.processPage = processPage;
