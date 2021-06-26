const path = require('path');
const postcss = require('postcss');
const url = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const purgeCSS = require('@fullhuman/postcss-purgecss');
const atImport = require("postcss-import");
const cssnano = require('cssnano');

const resolveUrl = assetsPath => (urlInfo) => {
  return `${assetsPath}/${path.basename(urlInfo.url)}`
};

const defaultOptions = {
  prefixes: [],
  destPath: undefined,
  fromFile: undefined,
  assetsPath: '',
  env: 'development',
  map: false,
  file: null,
};

async function cssTransformer(content, opt = defaultOptions) {
  opt = {...defaultOptions, ...opt};
  content = content ?? '';
  
  const prefixes = [
    atImport(),
    postcssPresetEnv({
      stage: 0
    }),
    ...opt.prefixes
  ];
  
  const options = {
    to: opt.destPath,
    from: opt.fromFile || opt?.file?.fileAbsolutePath,
  }
  
  let post = null;
  
  if (opt.env === 'production') {
    post = postcss([
      ...prefixes,
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
        url: resolveUrl(opt.assetsPath)
      }));
    }
    
    options.map = true;
  } else {
    post = postcss(prefixes);
  }
  
  return post
    .process(content, options)
    .then(res => {
      return res.css;
    })
}

module.exports.cssTransformer = cssTransformer;
module.exports.defaultOptions = defaultOptions;
