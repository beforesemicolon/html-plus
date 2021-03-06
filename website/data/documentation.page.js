const docLink = '/documentation';
const routesLink = '/documentation/routes';
const dataLink = '/documentation/data';
const templatingDataBindingLink = '/documentation/template-data-binding';
const templatingLink = '/documentation/templating';
const advTemplatingLink = '/documentation/advanced-templating';
const stylingLink = '/documentation/styling';
const scriptingLink = '/documentation/scripting';
const assetsLink = '/documentation/static-assets';
const serveLiveLink = '/documentation/serve-live';
const buildLink = '/documentation/build-static-site';
const faqLink = '/documentation/faq';
const apiReferenceLink = '/documentation/api-reference';
const faqs = require('./faqs.json');
const site = require('./site');

function addNextAndPrevPaths(list, preListItem, postListItem) {
  for (let i = 0; i < list.length; i++) {
    const currentItem = list[i];
    const prevItem = list[i - 1] ?? preListItem;
    const nextItem = list[i + 1] ?? postListItem;
  
    if (prevItem) {
      currentItem.prev = {path: prevItem.path, title: prevItem.title}
    }
    
    if (list[i].list?.length) {
      const firstSubItem  = list[i].list[0];
      currentItem.next = {path: firstSubItem.path, title: firstSubItem.title}
      list[i].list = addNextAndPrevPaths(list[i].list, currentItem, list[i + 1]);
    } else if(nextItem) {
      currentItem.next = {path: nextItem.path, title: nextItem.title}
    }
  }
  
  return list;
}

const data = {
  path: docLink,
  title: "HTML+ Documentation",
  description: `HTML Plus - ${site.description}`,
  searchLabel: 'Search...',
  partial: 'documentation',
  next: {path: `${docLink}/getting-started`, title: 'Get Started'},
  menu: {
    title: 'Documentation',
    list: [
      {
        title: "Getting Started",
        path: `${docLink}/getting-started`,
        partial: 'getting-started',
      },
      {
        title: "Routes",
        path: routesLink,
        partial: 'routes',
        list: [
          {
            title: "Pages",
            path: `${routesLink}/pages`,
            partial: 'pages'
          },
          {
            title: "Route Pages",
            path: `${routesLink}/route-pages`,
            partial: 'route-pages'
          },
        ],
      },
      {
        title: "Data",
        path: dataLink,
        partial: 'data',
        list: [
          {
            title: "Static Data",
            path: `${dataLink}/static-data`,
            partial: 'static-data'
          },
          {
            title: "Dynamic Data",
            path: `${dataLink}/dynamic-data`,
            partial: 'dynamic-data'
          },
          {
            title: "Local Context Data",
            path: `${dataLink}/local-context-data`,
            partial: 'local-context-data'
          }
        ]
      },
      {
        title: "Template data binding",
        path: templatingDataBindingLink,
        partial: 'template-data-binding',
      },
      {
        title: "Templating",
        path: templatingLink,
        partial: 'templating',
        list: [
          {
            title: "Partials and Include",
            path: `${templatingLink}/partials-and-include`,
            partial: 'partials-and-include'
          },
          {
            title: "Inject HTML",
            path: `${templatingLink}/inject-html`,
            partial: 'inject-html'
          },
          {
            title: "Conditional Rendering",
            path: `${templatingLink}/conditional-rendering`,
            partial: 'conditional-rendering'
          },
          {
            title: "Repeating Markup",
            path: `${templatingLink}/repeating-markup`,
            partial: 'repeating-markup'
          },
          {
            title: "Variables",
            path: `${templatingLink}/variables`,
            partial: 'variables'
          },
          {
            title: "Fragment & Ignore",
            path: `${templatingLink}/fragment-and-ignore`,
            partial: 'fragment-and-ignore'
          },
          {
            title: "Debugging",
            path: `${templatingLink}/debugging`,
            partial: 'debugging'
          },
        ]
      },
      {
        title: "Advanced Templating",
        path: advTemplatingLink,
        partial: 'advanced-templating',
        list: [
          {
            title: "Custom tags",
            path: `${advTemplatingLink}/custom-tags`,
            partial: 'custom-tags'
          },
          {
            title: "Custom tags Style",
            path: `${advTemplatingLink}/custom-tags-style`,
            partial: 'custom-tags-style'
          },
          {
            title: "Custom attributes",
            path: `${advTemplatingLink}/custom-attributes`,
            partial: 'custom-attributes'
          },
          {
            title: "Partials as \"Component\"",
            path: `${advTemplatingLink}/partials-as-components`,
            partial: 'partials-as-components'
          },
        ]
      },
      {
        title: "Styling",
        path: stylingLink,
        partial: 'styling',
        list: [
          {
            title: "CSS Preprocessors",
            path: `${stylingLink}/css-preprocessors`,
            partial: 'css-preprocessors',
          },
          {
            title: "Modern CSS",
            path: `${stylingLink}/modern-css`,
            partial: 'modern-css',
          }
        ]
      },
      {
        title: "Scripting",
        path: scriptingLink,
        partial: 'scripting',
      },
      {
        title: "Static Assets",
        path: assetsLink,
        partial: 'static-assets',
      },
      {
        title: "Build Static Site",
        path: buildLink,
        partial: 'build-static',
        list: [
          {
            title: "Build Static Pages",
            path: `${buildLink}/static-pages`,
            partial: 'static-pages',
          },
          {
            title: "Build By Data",
            path: `${buildLink}/by-data`,
            partial: 'by-data',
          },
        ]
      },
      {
        title: "Serve Live",
        path: serveLiveLink,
        partial: 'serve-live',
      },
      {
        title: "FAQ",
        path: faqLink,
        partial: 'faq',
        data: faqs
      },
      {
        title: 'API References',
        path: apiReferenceLink,
        partial: 'api-reference',
        list: [
          {
            title: "#attr",
            path: `${apiReferenceLink}/attr-attribute`,
            partial: 'attr-attribute',
          },
          {
            title: "build()",
            path: `${apiReferenceLink}/build-function`,
            partial: 'build-function'
          },
          {
            title: "Comment",
            path: `${apiReferenceLink}/comment-class`,
            partial: 'comment-class',
          },
          {
            title: "CustomAttribute",
            path: `${apiReferenceLink}/custom-attribute-class`,
            partial: 'custom-attribute-class'
          },
          {
            title: "Element",
            path: `${apiReferenceLink}/element-class`,
            partial: 'element-class',
          },
          {
            title: "engine()",
            path: `${apiReferenceLink}/engine-function`,
            partial: 'engine-function'
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
            title: "html()",
            path: `${apiReferenceLink}/html-function`,
            partial: 'html-function',
          },
          {
            title: "<ignore/>",
            path: `${apiReferenceLink}/ignore-tag`,
            partial: 'ignore-tag',
          },
          {
            title: "#ignore",
            path: `${apiReferenceLink}/ignore-attribute`,
            partial: 'ignore-attribute',
          },
          {
            title: "importStyle()",
            path: `${apiReferenceLink}/import-style-function`,
            partial: 'import-style-function',
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
            title: "Text",
            path: `${apiReferenceLink}/text-class`,
            partial: 'text-class',
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
};

data.menu.list = addNextAndPrevPaths(data.menu.list, data);

module.exports = data;
