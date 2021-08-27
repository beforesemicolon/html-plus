const chalk = require("chalk");

function escapeRegex(string) {
  return string.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function handleError(e, node = {}, file) {
  if (e.message.startsWith('Error: ')) {
      throw e;
  }
  
  let errMsg = e.message;
  let text = '';
  let nodeString = '';
  
  if (node.nodeName === '#text' || node.nodeName === '#comment') {
    text = node.nodeValue;
    let parentString = (node.parentNode)?.outerHTML || '';
    nodeString = parentString
      ? parentString.replace(new RegExp(escapeRegex(text), 'm'), chalk.redBright(`\n${text.trim()} <= Error: ${errMsg}\n`))
      : text;
  } else {
    nodeString = node.outerHTML ?? '';
  }
  
  const fileInfo = file
    ? `\nFile: ${chalk.yellow(file.filePath)}`
    : '';
  
  throw new Error(
    'Error: ' + chalk.redBright(errMsg) + fileInfo +
    `\nMarkup: ${chalk.green(nodeString)}`
  );
}

module.exports.handleError = handleError;
