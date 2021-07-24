const defaultOptions = {
  staticData: {},
  customTags: [],
  customAttributes: [],
  env: 'development',
  sass: {
    indentWidth: 2,
    precision: 5,
    indentType: 'space',
    linefeed: 'lf',
    sourceComments: false,
    includePaths: [],
    functions: {},
  },
  less: {
    strictUnits: false,
    insecure: false,
    paths: [],
    math: 1,
    urlArgs: '',
    modifyVars: null,
    lint: false,
  },
  stylus: {
    paths: [],
  },
  postCSS: {
    plugins: []
  },
  onPageRequest() {
  }
}

module.exports.defaultOptions = defaultOptions;
