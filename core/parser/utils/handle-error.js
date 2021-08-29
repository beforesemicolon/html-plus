const chalk = require("chalk");

/**
 * handle error that happens inside Element, Text, custom attributes and tags
 * @param e
 * @param node
 * @param file
 */
function handleError(e, node = {}, file) {
  /**
   * if the error happened inside nested files it will propagate to parent files
   * so if it is an error already thrown by handleError we just rethrow it to propagate it up
   */
  if (e.message.startsWith('Error: ')) {
      throw e;
  }
  
  let errMsg = e.message;
  let text = '';
  let nodeString = '';
  
  if (node.nodeName === '#text' || node.nodeName === '#comment') {
    text = node.nodeValue;
    let parentString = (node.parentNode)?.outerHTML || '';
    /**
     * nice touch to have an error point right at the text where it failed
     * @type {string|*|string}
     */
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

function escapeRegex(string) {
  return string.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports.handleError = handleError;
