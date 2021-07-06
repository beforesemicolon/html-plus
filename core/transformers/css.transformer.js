const path = require('path');
const postcss = require('postcss');
const url = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const purgeCSS = require('@fullhuman/postcss-purgecss');
const atImport = require("postcss-import");
const cssnano = require('cssnano');
const comments = require('postcss-discard-comments');
const {uniqueAlphaNumericId} = require("../utils/unique-alpha-numeric-id");
const {readFileContent} = require("../utils/readFileContent");

const resolveUrl = (assetsPath, linkedResources, assetsHashedMap) => (urlInfo) => {
  let absPath = urlInfo.absolutePath;
  if (!assetsHashedMap[absPath]) {
    const relativePath = urlInfo.relativePath.match(/(?=\w).+/)[0];
    let found = false;
    
    for (let key in assetsHashedMap) {
      if (key.endsWith(relativePath)) {
        absPath = key;
        found = true;
        break;
      }
    }
    
    if (!found) {
      assetsHashedMap[urlInfo.absolutePath] = {
        path: urlInfo.absolutePath,
        hash: uniqueAlphaNumericId(8)
      }
    }
  }
  
  linkedResources.push(absPath);
  
  const ext = path.extname(urlInfo.url);
  const hashedFileName = path
    .basename(urlInfo.url)
    .replace(/\.[a-zA-Z0-9]{2,}$/, `-${assetsHashedMap[absPath].hash}${ext}`)
  
  return `${assetsPath}/${hashedFileName}`;
};

const defaultOptions = {
  plugins: [],
  destPath: undefined,
  assetsPath: '',
  assetsHashedMap: {},
  env: 'development',
  map: false,
  file: null
};

async function cssTransformer(content, opt = defaultOptions) {
  if (content === undefined || content === null) {
      return '';
  }
  
  if (typeof content === 'object') {
    opt = content;
    content = null;
  
    if (!opt.file) {
      throw new Error('If no string content is provided, the "file" option must be provided.')
    }
  }
  
  opt = {...defaultOptions, ...opt};
  content = content ?? readFileContent(opt.file.fileAbsolutePath);
  
  const plugins = [
    atImport(),
    postcssPresetEnv({
      stage: 0
    }),
    ...opt.plugins
  ];
  
  const options = {
    to: opt.destPath,
    from: opt.file?.fileAbsolutePath,
  }
  
  let post = null;
  const linkedResources = [];
  
  if (opt.env === 'production') {
    post = postcss([
      ...plugins,
      comments({removeAll: true}),
      purgeCSS({
        content: [
          `${opt.destPath || opt.file.srcDirectoryPath}/**/*.html`
        ],
        css: [
          opt.file.fileAbsolutePath
        ]
      }),
      cssnano
    ]);
    
    if (opt.assetsPath) {
      post.use(url({
        url: resolveUrl(opt.assetsPath, linkedResources, opt.assetsHashedMap || {}, opt.file)
      }));
    }
    
    options.map = true;
  } else {
    post = postcss(plugins);
  }
  
  return post
    .process(content, options)
    .then(res => {
      return opt.env === 'production' || opt.file
        ? {content: res.css, linkedResources}
        : res.css;
    })
}

module.exports.cssTransformer = cssTransformer;
module.exports.defaultOptions = defaultOptions;
