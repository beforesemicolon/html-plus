const esbuild = require('esbuild');
const path = require('path');
const {File} = require("../File");

const defaultOptions = {
  env: 'development',
  file: null,
  target: 'es2016',
  envVariables: {},
  loader: 'js',
  tsConfigPath: '',
  sourcemap: false,
  sourceFile: '',
  workingDirectoryPath: ''
}

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
  const configPath = opt.tsConfigPath || path.resolve(__dirname, workingDirectory, 'tsconfig.json');
  
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
    
    return esbuild.build({
        ...options,
        tsconfig: configPath,
        absWorkingDir: workingDirectory,
        entryPoints: [opt.file.fileAbsolutePath],
        bundle: true,
        write: false,
      })
      .then(res => {
        res.warnings.forEach(console.warn);
        return res.outputFiles[0].text;
      })
      .catch(e => {
        throw new Error(e.message)
      });
  }
  
  return '';
}

module.exports.jsTransformer = jsTransformer;
// module.exports.defaultOptions = defaultOptions;