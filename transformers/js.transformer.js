const esbuild = require('esbuild');

const defaultOptions = {
  plugins: [],
  presets: [],
  env: 'development',
  fileObject: {},
  target: 'es6',
  loader: 'js',
  tsConfig: {}
}

async function jsTransformer(content, opt = defaultOptions) {

  opt = {...defaultOptions, ...opt};
  const isProduction = opt.env === 'production';
  const options = {
    target: opt.target,
    define: {
      'process.env.NODE_ENV': `"${opt.env}"`
    },
    ...(isProduction && {treeShaking: true}),
    ...(isProduction && {minify: true}),
    ...(isProduction && {sourcemap: true}),
  };
  
  if (typeof content === 'string') {
    return esbuild.transform(content, {
        ...options,
        loader: opt.fileObject.ext.substring(1),
        sourcefile: opt.fileObject?.file
      })
      .then(res => {
        res.warnings.forEach(console.warn);
        return `${res.code}${res.map}`;
      })
  }
  
  options.platform = opt.platform || 'node';
  
  if (opt.platform === 'browser') {
    options.format = 'iife'
  }
  
  return Promise.all([
      esbuild.build({
        ...options,
        platform: opt.platform || 'node',
        entryPoints: [opt.fileObject.fileAbsolutePath],
        bundle: true,
        write: false,
      }).then(res => {
        res.warnings.forEach(console.warn);
        return res.outputFiles[0].text;
      }),
      // (/\.tsx?/.test(opt.fileObject.ext) && opt.platform !== 'browser'
      //   ? exec(`${tsNodePath} ${opt.fileObject.fileAbsolutePath} --noEmit --log-error -r --project ${process.cwd()}/tsconfig.json`)
      //   : Promise.resolve({}))
    ])
    .then(([res]) => res)
    .catch(e => {
      throw new Error(e.message)
    });
}

module.exports.jsTransformer = jsTransformer;
// module.exports.defaultOptions = defaultOptions;