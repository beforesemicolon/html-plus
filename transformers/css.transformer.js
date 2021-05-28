const path = require('path');
const postcss = require('postcss');
const url = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const purgecss = require('@fullhuman/postcss-purgecss')
const cssnano = require('cssnano');

const resolveUrl = assetsPath => (urlInfo) => {
  return `${assetsPath}/${path.basename(urlInfo.url)}`
};

const defaultOptions = {
  prefixes: [],
  destPath: undefined,
  assetsPath: './assets',
  env: 'development',
  map: false,
  fileObject: null
};

async function cssTransformer(content, opt = defaultOptions) {
  if (!content || typeof content !== 'string') return '';
  
  opt = {...defaultOptions, ...opt};
  
  const prefixes = [
    postcssPresetEnv({
      stage: 0
    }),
    ...opt.prefixes
  ];
  
  const options = {
    to: opt.destPath,
  }
  
  let post = null;
  
  if (opt.env === 'production') {
    post = postcss([
      ...prefixes,
      purgecss({
        content: [
          `${opt.fileObject.srcDirectoryPath}/**/*.html`
        ],
        css: [
          opt.fileObject.fileAbsolutePath
        ]
      }),
      cssnano
    ]);
    post.use(url({
      url: resolveUrl(opt.assetsPath)
    }));
    options.map = true;
  } else {
    post = postcss(prefixes);
  }
  
  return post
    .process(content, {from: opt?.fileObject?.fileAbsolutePath, ...options})
    .then(res => {
      return res.css;
    })
}

module.exports.cssTransformer = cssTransformer;
module.exports.defaultOptions = defaultOptions;
