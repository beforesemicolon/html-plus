const path = require('path');

function getFileSourceHashedDestPath(src, hash) {
  let fileDestPath = '';
  const ext = path.extname(src);
  
  switch (ext) {
    case '.sass':
    case '.scss':
      fileDestPath = path.join('stylesheets', path.basename(src).replace(/\.s.ss$/, `-${hash}.css`))
      break;
    case '.less':
      fileDestPath = path.join('stylesheets', path.basename(src).replace(/\.less$/, `-${hash}.css`))
      break;
    case '.styl':
      fileDestPath = path.join('stylesheets', path.basename(src).replace(/\.styl$/, `-${hash}.css`))
      break;
    case '.css':
      fileDestPath = path.join('stylesheets', path.basename(src).replace(/\.css$/, `-${hash}.css`))
      break;
    case '.js':
    case '.mjs':
    case '.cjs':
    case '.ts':
    case '.jsx':
    case '.tsx':
      fileDestPath = path.join('scripts', path.basename(src).replace(/\.(?:c|m)?(?:t|j)sx?$/, `-${hash}.js`))
      break;
    default:
      fileDestPath = path.join('assets', path.basename(src).replace(/\.[a-zA-Z0-9]{2,}$/, `-${hash}${ext}`))
  }
  
  return fileDestPath;
}

module.exports.getFileSourceHashedDestPath = getFileSourceHashedDestPath;