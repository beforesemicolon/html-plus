const chalk = require("chalk");

function escapeRegex(string) {
  return string.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function handleError(e, node = {}, file) {
  let error = e.message;
  
  if (node.nodeName === '#text' || node.nodeName === '#comment') {
    throw new Error(`${error} <=> ${node.nodeValue}`);
  }
  
  if (error && error.startsWith('Error: ')) {
    throw new Error(error)
  }
  
  const [errMsg, text = ''] = error.split('<=>');
  const nodeString = text
    ? ((node).outerHTML ?? '').replace(new RegExp(escapeRegex(text), 'gm'), chalk.redBright(`\n${text.trim()} <= Error: ${errMsg}\n`))
    : node.outerHTML ?? '';
  
  const fileInfo = file
    ? `\nFile: ${chalk.yellow(file.filePath)}`
    : '';
  
  throw new Error(
    'Error: ' + chalk.redBright(errMsg) + fileInfo +
    `\nMarkup: ${chalk.green(nodeString)}`
  );
}

module.exports.handleError = handleError;
