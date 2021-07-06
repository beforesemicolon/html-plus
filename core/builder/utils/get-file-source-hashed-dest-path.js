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
    case '.cjs':
    case '.ts':
    case '.jsx':
    case '.tsx':
      fileDestPath = path.join('scripts', path.basename(src).replace(/\.(?:c|m)?(?:t|j)sx?$/, `-${hash}.js`))
      break;
    case '.mjs':
      fileDestPath = path.join('scripts', path.basename(src).replace('.mjs', `-${hash}.mjs`))
      break;
    default:
      fileDestPath = path.join('assets', path.basename(src))
  }
  
  return fileDestPath;
}

module.exports.getFileSourceHashedDestPath = getFileSourceHashedDestPath;