const chalk = require("chalk");
const {undoSpecialCharactersInHTML} = require("./utils/undo-special-characters-in-HTML");
const {TextNode} = require("node-html-parser");

function handleError(e, node, options) {
  let error = e.message;
  
  if (node instanceof TextNode) {
    throw new Error(`${error}||${node.rawText}`)
  }
  
  if (e.message && e.message.startsWith('HTML: ')) {
    throw new Error(error)
  }
  
  const [errMsg, text] = error.split('||');
  const nodeString = text
    ? ((node.parentNode || node).outerHTML).replace(text, chalk.redBright(`\n${text.trim()} <= Error: ${errMsg}\n`))
    : node.outerHTML;
  
  const fileInfo = options.fileObject
    ? `\n:File \n${chalk.yellow(options.fileObject?.filePath)}`
    : '';
  
  throw new Error(
    'HTML: ' +
    chalk.redBright(errMsg) + fileInfo +
    `\n\n:Markup \n${chalk.green(undoSpecialCharactersInHTML(nodeString))}`
  );
}

module.exports.handleError = handleError;
