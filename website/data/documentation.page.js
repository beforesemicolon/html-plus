const docLink = '/documentation';
const routesLink = '/documentation/routes';
const dataLink = '/documentation/data';
const templatingDataBindingLink = '/documentation/template-data-binding';
const templatingLink = '/documentation/templating';
const advTemplatingLink = '/documentation/advanced-templating';
const stylingLink = '/documentation/styling';
const scriptingLink = '/documentation/scripting';
const buildLink = '/documentation/build';
const transformLink = '/documentation/transform-files';
const faqLink = '/documentation/faq';
const apiReferenceLink = '/documentation/api-reference';
const vocabularyLink = '/documentation/vocabulary';

module.exports = {
  path: docLink,
  title: "Documentation",
  description: "HTML+ - HTML template language, engine and site builder",
  searchLabel: 'Search...',
  partial: 'documentation',
  next: {path: `${docLink}/getting-started`, title: 'Getting Started'},
  menu: {
    title: 'Documentation',
    list: [
      {
        title: "Getting Started",
        path: `${docLink}/getting-started`,
        prev: {path: docLink, title: 'Documentation'},
        next: {path: routesLink, title: 'Routes'},
        partial: 'getting-started',
      },
      {
        title: "Routes",
        path: routesLink,
        prev: {path: `${docLink}/getting-started`, title: 'Getting Started'},
        next: {path: `${routesLink}/pages`, title: 'Pages'},
        partial: 'routes',
        list: [
          {
            title: "Pages",
            path: `${routesLink}/pages`,
            prev: {path: routesLink, title: 'Routes'},
            next: {path: `${routesLink}/route-pages`, title: 'Route Pages'},
            partial: 'pages'
          },
          {
            title: "Route Pages",
            path: `${routesLink}/route-pages`,
            prev: {path: `${routesLink}/pages`, title: 'Pages'},
            next: {path: dataLink, title: 'Data'},
            partial: 'route-pages'
          },
        ],
      },
      {
        title: "Data",
        path: dataLink,
        prev: {path: `${routesLink}/route-pages`, title: 'Route Pages'},
        next: {path: `${dataLink}/static-data`, title: 'Static Data'},
        partial: 'data',
        list: [
          {
            title: "Static Data",
            path: `${dataLink}/static-data`,
            prev: {path: dataLink, title: 'Data'},
            next: {path: `${dataLink}/dynamic-data`, title: 'Dynamic Data'},
            partial: 'static-data'
          },
          {
            title: "Dynamic Data",
            path: `${dataLink}/dynamic-data`,
            prev: {path: `${dataLink}/static-data`, title: 'Static Data'},
            next: {path: `${dataLink}/local-context-data`, title: 'Local Context Data'},
            partial: 'dynamic-data'
          },
          {
            title: "Local Context Data",
            path: `${dataLink}/local-context-data`,
            prev: {path: `${dataLink}/dynamic-data`, title: 'Dynamic Data'},
            next: {path: templatingDataBindingLink, title: 'Template data binding'},
            partial: 'local-context-data'
          }
        ]
      },
      {
        title: "Template data binding",
        path: templatingDataBindingLink,
        prev: {path: dataLink, title: 'Context Data'},
        next: {path: templatingLink, title: 'Templating'},
        partial: 'template-data-binding',
      },
      {
        title: "Templating",
        path: templatingLink,
        prev: {path: templatingDataBindingLink, title: 'Template data binding'},
        next: {path: `${templatingLink}/partials-and-include`, title: 'Partials and Include'},
        partial: 'templating',
        list: [
          {
            title: "Partials and Include",
            path: `${templatingLink}/partials-and-include`,
            prev: {path: templatingLink, title: 'Templating'},
            next: {path: `${templatingLink}/inject-html`, title: 'Inject HTML'},
            partial: 'partials-and-include'
          },
          {
            title: "Inject HTML",
            path: `${templatingLink}/inject-html`,
            prev: {path: `${templatingLink}/partials-and-include`, title: 'Partials and Include'},
            next: {path: `${templatingLink}/conditional-rendering`, title: 'Conditional Rendering'},
            partial: 'inject-html'
          },
          {
            title: "Conditional Rendering",
            path: `${templatingLink}/conditional-rendering`,
            prev: {path: `${templatingLink}/inject-html`, title: 'Inject HTML'},
            next: {path: `${templatingLink}/repeating-markup`, title: 'Repeating Markup'},
            partial: 'conditional-rendering'
          },
          {
            title: "Repeating Markup",
            path: `${templatingLink}/repeating-markup`,
            prev: {path: `${templatingLink}/conditional-rendering`, title: 'Conditional Rendering'},
            next: {path: `${templatingLink}/variables`, title: 'Variables'},
            partial: 'repeating-markup'
          },
          {
            title: "Variables",
            path: `${templatingLink}/variables`,
            prev: {path: `${templatingLink}/repeating-markup`, title: 'Repeating Markup'},
            next: {path: `${templatingLink}/fragment-and-ignore`, title: 'Fragment & Ignore'},
            partial: 'variables'
          },
          {
            title: "Fragment & Ignore",
            path: `${templatingLink}/fragment-and-ignore`,
            prev: {path: `${templatingLink}/variables`, title: 'Variables'},
            next: {path: `${templatingLink}/debugging`, title: 'Debugging'},
            partial: 'fragment-and-ignore'
          },
          {
            title: "Debugging",
            path: `${templatingLink}/debugging`,
            prev: {path: `${templatingLink}/fragment-and-ignore`, title: 'Fragment & Ignore'},
            next: {path: advTemplatingLink, title: 'Advanced Templating'},
            partial: 'debugging'
          },
        ]
      },
      {
        title: "Advanced Templating",
        path: advTemplatingLink,
        prev: {path: `${templatingLink}/debugging`, title: 'Debugging'},
        next: {path: `${advTemplatingLink}/custom-tags`, title: 'Custom tags'},
        partial: 'advanced-templating',
        list: [
          {
            title: "Custom tags",
            path: `${advTemplatingLink}/custom-tags`,
            prev: {path: advTemplatingLink, title: 'Advanced Templating'},
            next: {path: `${advTemplatingLink}/custom-attributes`, title: 'Custom attributes'},
            partial: 'custom-tags'
          },
          {
            title: "Custom attributes",
            path: `${advTemplatingLink}/custom-attributes`,
            prev: {path: `${advTemplatingLink}/custom-tags, title`, title: 'Custom tags'},
            next: {path: `${advTemplatingLink}/partials-as-components`, title: 'Partials as Component'},
            partial: 'custom-attributes'
          },
          {
            title: "Partials as \"Component\"",
            path: `${advTemplatingLink}/partials-as-components`,
            prev: {path: `${advTemplatingLink}/custom-attributes`, title: 'Custom attributes'},
            next: {path: stylingLink, title: 'Styling'},
            partial: 'partials-as-components'
          },
        ]
      },
      {
        title: "Styling",
        path: stylingLink,
        prev: {path: `${advTemplatingLink}/partials-as-components`, title: 'Partials as Component'},
        next: {path: `${stylingLink}/css-preprocessors`, title: 'CSS Preprocessors'},
        partial: 'styling',
        list: [
          {
            title: "CSS Preprocessors",
            path: `${stylingLink}/css-preprocessors`,
            prev: {path: stylingLink, title: 'Styling'},
            next: {path: `${stylingLink}/modern-css`, title: 'Modern CSS'},
            partial: 'css-preprocessors',
          },
          {
            title: "Modern CSS",
            path: `${stylingLink}/modern-css`,
            prev: {path: `${stylingLink}/css-preprocessors`, title: 'CSS Preprocessors'},
            next: {path: scriptingLink, title: 'Scripting'},
            partial: 'modern-css',
          }
        ]
      },
      {
        title: "Scripting",
        path: scriptingLink,
        prev: {path: `${stylingLink}/modern-css`, title: 'Modern CSS'},
        next: {path: transformLink, title: 'Transform Files'},
        partial: 'scripting',
      },
      {
        title: "Transform Files",
        path: transformLink,
        prev: {path: scriptingLink, title: 'Scripting'},
        next: {path: buildLink, title: 'Build Project'},
        partial: 'transform-files',
      },
      {
        title: "Build Project",
        path: buildLink,
        prev: {path: scriptingLink, title: 'Scripting'},
        next: {path: `${buildLink}/static-pages`, title: 'Static Pages'},
        partial: 'build',
        list: [
          {
            title: "Static Pages",
            path: `${buildLink}/static-pages`,
            prev: {path: buildLink, title: 'Build'},
            next: {path: `${buildLink}/by-data`, title: 'By Data'},
            partial: 'static-pages',
          },
          {
            title: "By Data",
            path: `${buildLink}/by-data`,
            prev: {path: scriptingLink, title: 'Scripting'},
            next: {path: faqLink, title: 'FAQ'},
            partial: 'by-data',
          },
        ]
      },
      {
        title: "FAQ",
        path: faqLink,
        prev: {path: scriptingLink, title: 'Scripting'},
        next: {path: apiReferenceLink, title: 'API Reference'},
        partial: 'faq',
      },
      {
        title: 'API Reference',
        path: apiReferenceLink,
        prev: {path: faqLink, title: 'FAQ'},
        partial: 'api-reference',
        list: [
          {
            title: "Attribute",
            path: `${apiReferenceLink}/attribute-class`,
            partial: 'attributes'
          },
          {
            title: "composeTagString()",
            path: `${apiReferenceLink}/compose-tag-string`,
            partial: 'compose-tag-string'
          },
          {
            title: "engine()",
            path: `${apiReferenceLink}/engine`,
            partial: 'engine'
          },
          {
            title: "File",
            path: `${apiReferenceLink}/file-class`,
            partial: 'file-class',
          },
          {
            title: "<fragment/>",
            path: `${apiReferenceLink}/fragment-tag`,
            partial: 'fragment-tag',
          },
          {
            title: "#fragment",
            path: `${apiReferenceLink}/fragment-attribute`,
            partial: 'fragment-attribute',
          },
          {
            title: "#if",
            path: `${apiReferenceLink}/if-attribute`,
            partial: 'if-attribute',
          },
          {
            title: "<ignore/>",
            path: `${apiReferenceLink}/ignore-tag`,
            partial: 'ignore-tag',
          },
          {
            title: "<include/>",
            path: `${apiReferenceLink}/include-tag`,
            partial: 'include-tag',
          },
          {
            title: "<inject/>",
            path: `${apiReferenceLink}/inject-tag`,
            partial: 'inject-tag',
          },
          {
            title: "<log/>",
            path: `${apiReferenceLink}/log-tag`,
            partial: 'log-tag',
          },
          {
            title: "PartialFile",
            path: `${apiReferenceLink}/partial-file-class`,
            partial: 'partial-file-class',
          },
          {
            title: "#repeat",
            path: `${apiReferenceLink}/repeat-attribute`,
            partial: 'repeat-attribute',
          },
          {
            title: "transform()",
            path: `${apiReferenceLink}/transform`,
            partial: 'transform',
          },
          {
            title: "<variable/>",
            path: `${apiReferenceLink}/variable-tag`,
            partial: 'variable-tag',
          },
        ]
      },
    ]
  }
}