const chalk = require("chalk");
const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
const {TextNode} = require("node-html-parser");

function escapeRegex(string) {
  return string.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function handleError(e, node = {}, options = {}) {
  let error = e.message;
  
  if (node instanceof TextNode) {
    throw new Error(`${error} <=> ${node.rawText}`)
  }
  
  if (error && error.startsWith('Error: ')) {
    throw new Error(error)
  }
  
  const [errMsg, text = ''] = error.split('<=>');
  const nodeString = text
    ? ((node).outerHTML ?? '').replace(new RegExp(escapeRegex(text), 'gm'), chalk.redBright(`\n${text.trim()} <= Error: ${errMsg}\n`))
    : node.outerHTML ?? '';
  
  const fileInfo = options.fileObject
    ? `\nFile: ${chalk.yellow(options.fileObject.filePath)}`
    : '';
  
  throw new Error(
    'Error: ' + chalk.redBright(errMsg) + fileInfo +
    `\nMarkup: ${chalk.green(undoSpecialCharactersInHTML(nodeString))}`
  );
}

module.exports.handleError = handleError;
