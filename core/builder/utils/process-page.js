const {transform} = require("../../transform");
const {File} = require("../../File");
const {collectAndUpdateNodeSourceLink} = require('./collect-and-update-node-source-link');
const path = require('path');
const {defaultTagsMap} = require("../../parser/default-tags");
const {defaultAttributes} = require("../../parser/default-attributes");
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
  
  const content = await transform(file.toString(), {
    file,
    data: opt.staticData,
    context: opt.contextData,
    customTags: opt.customTags,
    defaultTags: defaultTagsMap,
    defaultAttributes: defaultAttributes,
    customAttributes: opt.customAttributes,
    partialFiles: opt.partials,
    env: opt.env,
    onBeforeRender: (node, nodeFile) => {
      const src = collectAndUpdateNodeSourceLink(node, nodeFile, resources, fileDirPath);
  
      // collect any tag style if not already collected
      if (opt.customTagStyles[node.tagName] && !usedTagsWithStyle.has(node.tagName)) {
        usedTagsWithStyle.add(node.tagName)
      }
      
      if (src) {
        linkedSources.push(src);
      }
    }
  }).then(async html => {
    // include the collected styles at the end of the head tag
    if (usedTagsWithStyle.size) {
      return injectTagStylesToPage(html, await collectPageTagsStyle(usedTagsWithStyle, opt.customTagStyles))
    }
  
    return html;
  })
  
  return {
    content,
    linkedSources,
    usedTagsWithStyle,
    file: new File(fileExportName, opt.srcDir)
  };
}

module.exports.processPage = processPage;
