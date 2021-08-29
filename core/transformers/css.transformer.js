const path = require('path');
const postcss = require('postcss');
const url = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const purgeCSS = require('@fullhuman/postcss-purgecss');
const atImport = require("postcss-import");
const cssnano = require('cssnano');
const comments = require('postcss-discard-comments');
const purgeHTML = require('purgecss-from-html');

const defaultOptions = {
  /**
   * any post CSS plugin already started https://www.postcss.parts/
   */
  plugins: [],
  /**
   * the director the file will go to
   */
  destPath: undefined,
  /**
   * the directory containing all the assets to resolve the linked assets path to
   */
  assetsPath: '',
  /**
   * a valid purgeCSS extractor
   */
  htmlExtractor: null,
  /**
   * environment mode
   */
  env: 'development',
  /**
   * flag whether to create source map or not
   */
  map: false,
  /**
   * File instance
   */
  file: null
};

/**
 * compiles CSS with PostCSS
 * @param content
 * @param opt
 * @returns {Promise<string|{linkedResources: *[], content: string}|string>}
 */
async function cssTransformer(content, opt = defaultOptions) {
  if (content === undefined || content === null) {
      return '';
  }
  
  /**
   * content can be left out completely by providing an option
   * which contains a file to read the content from
   */
  if (typeof content === 'object') {
    opt = content;
    content = null;
  
    if (!opt.file) {
      throw new Error('If no string content is provided, the "file" option must be provided.')
    }
  }
  
  opt = {...defaultOptions, ...opt};
  
  if (!content) {
    opt.file.load();
    
    content = opt.file.content
  }
  
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
    const htmlExtractor = opt.htmlExtractor || defaultHtmlExtractor(opt.file.file);
    
    post = postcss([
      ...plugins,
      comments({removeAll: true}),
      purgeCSS({
        // https://purgecss.com/extractors.html
        extractors: [
          {
            extractor: htmlExtractor,
            extensions: ['html']
          }
        ],
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
        url: resolveUrl(opt.assetsPath, linkedResources)
      }));
    }
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

/**
 * replaces any CSS link to resolve to a specific directory
 * @param assetsPath
 * @param linkedResources
 * @returns {function(*): string}
 */
const resolveUrl = (assetsPath, linkedResources) => (urlInfo) => {
  // collect any css file absolute link
  linkedResources.push(urlInfo.absolutePath);
  
  return `${assetsPath}/${path.basename(urlInfo.url)}`;
};

/**
 * extract html selectors according to https://purgecss.com/extractors.html
 * @param fileName
 * @returns {(function(*=): (ExtractorResultDetailed|[]))|*}
 */
function defaultHtmlExtractor(fileName) {
  return content => {
    if (content.match(new RegExp(`${fileName}`, 'g'))) {
      return purgeHTML(content);
    }
    
    return [];
  }
}

module.exports.cssTransformer = cssTransformer;
module.exports.defaultOptions = defaultOptions;
