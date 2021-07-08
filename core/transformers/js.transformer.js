const esbuild = require('esbuild');
const path = require('path');
const {readFileContent} = require("../utils/readFileContent");
const {File} = require("../File");

const defaultOptions = {
  env: 'development',
  file: null,
  target: 'es2016',
  envVariables: {},
  loaders: {},
  loader: 'js',
  tsConfigPath: '',
  sourcemap: false,
  sourceFile: '',
  workingDirectoryPath: ''
}

const loaderPlugin = (file, linkedResources) => ({
  name: 'files',
  setup(build) {
    build.onLoad({ filter: /\.[a-zA-Z0-9]{2,}$/ }, async (args) => {
      const ext = path.extname(args.path);
      
      switch (ext) {
        case '.html':
        case '.xml':
        case '.svg':
          return {
            contents: readFileContent(args.path),
            loader: 'text',
          }
        case '.js':
        case '.mjs':
        case '.cjs':
          return {loader: 'js'}
        case '.ts':
        case '.tsx':
        case '.jsx':
        case '.json':
        case '.css':
          return {loader: ext.substring(1)}
        case '.txt':
          return {loader: 'text'}
        case '.data':
          return {loader: 'binary'}
        default:
          linkedResources.push(args.path);
          return {
            contents: args.path
              .replace(file.srcDirectoryPath, '')
              .replace(process.cwd(), ''),
            loader: 'file',
          }
      }
    })
  },
})

const getConfig = (opt, configPath) => {
  let config = null;
  
  if (
    opt.loader === 'ts'
    || opt.loader === 'tsx'
    || opt.file?.ext === '.ts'
    || opt.file?.ext === '.tsx'
  ) {
    try {
      config = require(configPath);
    } catch (e) {
    }
  }
  
  return config;
}

async function jsTransformer(content, opt = defaultOptions) {
  if (content && typeof content === 'object') {
    opt = content;
    content = null;
  
    if (!opt.file) {
      throw new Error('If no string content is provided, the "file" option must be provided.')
    }
  }
  
  opt = {...defaultOptions, ...opt};

  const isProduction = opt.env === 'production';
  const workingDirectory = opt.workingDirectoryPath || process.cwd();
  
  const options = {
    target: opt.target,
    treeShaking: true,
    define: {
      'process.env.NODE_ENV': `"${opt.env}"`,
      ...opt.envVariables
    },
    minify: isProduction,
    sourcemap: opt.sourcemap ? 'inline' : false
  };
  
  if (typeof content === 'string') {
    const configPath = opt.tsConfigPath || path.resolve(__dirname, workingDirectory, 'tsconfig.json');
    return esbuild.transform(content, {
        ...options,
        loader: opt.loader,
        sourcefile: opt.sourceFile,
        tsconfigRaw: getConfig(opt, configPath) || {}
      })
      .then(res => {
        res.warnings.forEach(console.warn);
        return `${res.code}${res.map}`;
      })
  }
  
  if (opt.file instanceof File) {
    options.platform = opt.platform || 'node';
    
    if (opt.platform === 'browser') {
      options.format = 'iife'
    }
    
    const linkedResources = []
    
    return esbuild.build({
        ...options,
        ...(opt.tsConfigPath && {tsconfig: opt.tsConfigPath}),
        absWorkingDir: workingDirectory,
        entryPoints: [opt.file.fileAbsolutePath],
        allowOverwrite: true,
        bundle: true,
        outdir: opt.file.srcDirectoryPath,
        write: false,
        plugins: [loaderPlugin(opt.file, linkedResources)]
      })
      .then(res => {
        res.warnings.forEach(console.warn);
        
        if (res.errors.length) {
            throw res.errors;
        }
        
        const out = res.outputFiles.find((file) => /\.(?:c|m)?(?:t|j)sx?$/.test(file.path));
        
        return {content: out.text, linkedResources}
      })
  }
  
  return '';
}

module.exports.jsTransformer = jsTransformer;
// module.exports.defaultOptions = defaultOptions;