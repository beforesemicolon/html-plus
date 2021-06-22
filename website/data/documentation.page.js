const docLink = '/documentation';
const routesLink = '/documentation/routes';
const dataLink = '/documentation/data';
const templatingDataBindingLink = '/documentation/template-data-binding';
const templatingLink = '/documentation/templating';
const stylingLink = '/documentation/styling';
const scriptingLink = '/documentation/scripting';
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
            next: {path: `${dataLink}/context-data`, title: 'Context Data'},
            partial: 'dynamic-data'
          },
          {
            title: "Context Data",
            path: `${dataLink}/context-data`,
            prev: {path: `${dataLink}/dynamic-data`, title: 'Dynamic Data'},
            next: {path: templatingDataBindingLink, title: 'Template data binding'},
            partial: 'context-data'
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
            next: {path: `${templatingLink}/custom-tags-and-attributes`, title: 'Custom tags and attributes'},
            partial: 'fragment-and-ignore'
          },
          {
            title: "Custom tags and attributes",
            path: `${templatingLink}/custom-tags-and-attributes`,
            prev: {path: `${templatingLink}/fragment-and-ignore`, title: 'Fragment & Ignore'},
            next: {path: `${templatingLink}/debugging`, title: 'Debugging'},
            partial: 'custom-tags-and-attributes'
          },
          {
            title: "Debugging",
            path: `${templatingLink}/debugging`,
            prev: {path: `${templatingLink}/custom-tags-and-attributes`, title: 'Custom tags and attributes'},
            next: {path: stylingLink, title: 'Styling'},
            partial: 'debugging'
          },
        ]
      },
      {
        title: "Styling",
        path: stylingLink,
        prev: {path: templatingLink, title: 'Debugging'},
        next: {path: scriptingLink, title: 'Scripting'},
        partial: 'styling',
      },
      {
        title: "Scripting",
        path: scriptingLink,
        prev: {path: stylingLink, title: 'Styling'},
        next: {path: apiReferenceLink, title: 'API Reference'},
        partial: 'scripting',
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