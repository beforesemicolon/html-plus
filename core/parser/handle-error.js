const chalk = require("chalk");
const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
const {TextNode} = require("node-html-parser");

function handleError(e, node, options) {
  let error = e.message;
  
  if (node instanceof TextNode) {
    throw new Error(`${error}||${node.rawText}`)
  }
  
  if (e.message && e.message.startsWith('Error: ')) {
    throw new Error(error)
  }
  
  const [errMsg, text] = error.split('||');
  const nodeString = text
    ? ((node.parentNode || node).outerHTML).replace(text, chalk.redBright(`\n${text.trim()} <= Error: ${errMsg}\n`))
    : node.outerHTML;
  
  const fileInfo = options.fileObject
    ? `\nFile: ${chalk.yellow(options.fileObject?.filePath)}`
    : '';
  
  throw new Error(
    'Error: ' + chalk.redBright(errMsg) + fileInfo +
    `\nMarkup: ${chalk.green(undoSpecialCharactersInHTML(nodeString))}`
  );
}

module.exports.handleError = handleError;
