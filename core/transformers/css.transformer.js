const path = require('path');
const postcss = require('postcss');
const url = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const purgeCSS = require('@fullhuman/postcss-purgecss');
const atImport = require("postcss-import");
const cssnano = require('cssnano');
const comments = require('postcss-discard-comments');
const {readFileContent} = require("../utils/readFileContent");

const resolveUrl = (assetsPath, linkedResources, file) => (urlInfo) => {
  if (file) {
    linkedResources.push(path.resolve(file.fileDirectoryPath, urlInfo.url)
      .replace(file.srcDirectoryPath, '')
      .replace(process.cwd(), ''));
  }
  
  return `${assetsPath}/${path.basename(urlInfo.url)}`
};

const defaultOptions = {
  plugins: [],
  destPath: undefined,
  assetsPath: '',
  env: 'development',
  map: false,
  file: null,
  pageFile: null,
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
    comments({removeAll: true}),
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
      purgeCSS({
        content: [
          `${opt.file.srcDirectoryPath}/**/*.html`
        ],
        css: [
          opt.file.fileAbsolutePath
        ]
      }),
      cssnano
    ]);
    
    if (opt.assetsPath) {
      post.use(url({
        url: resolveUrl(opt.assetsPath, linkedResources, opt.file)
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
