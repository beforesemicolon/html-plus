const docLink = '/documentation'

module.exports = {
  currentPath: "/documentation",
  title: "HTML+ Documentation",
  searchLabel: 'Search...',
  docs_menu: {
    title: 'Documentation',
    list: [
      {
        label: "Getting Started",
        path: `${docLink}/getting-started`,
        content: ` `,
      },
      {
        label: "Routing",
        path: `${docLink}/routing`,
        content: ``,
      },
      {
        label: "Data and Data Binding",
        path: `${docLink}/data-and-data-binding`,
        content: ``,
      },
      {
        label: "Data Context",
        path: `${docLink}/data-context`,
        content: ``,
      },
      {
        label: "Templating",
        path: `${docLink}/templating`,
        content: ``,
      },
      {
        label: "Styling",
        path: `${docLink}/styling`,
        content: ``,
      },
      {
        label: "Scripting",
        path: `${docLink}/scripting`,
        content: ``,
      },
      {
        label: "Create Custom Tag",
        path: `${docLink}/create-custom-tag`,
        content: ``,
      },
      {
        label: "Create Custom Attribute",
        path: `${docLink}/create-custom-attribute`,
        content: ``,
      },
      {
        label: "FAQ",
        path: `${docLink}/faq`,
        content: ``,
      },
    ]
  },
  api_menu: {
    title: 'API Reference',
    list: [
      {
        label: "Attribute",
        list: []
      },
      {
        label: "composeTagString",
        list: []
      },
      {
        label: "engine",
        list: []
      },
      {
        label: "File",
        list: []
      },
      {
        label: "<fragment>",
        list: []
      },
      {
        label: "#fragment",
        list: []
      },
      {
        label: "#if",
        list: []
      },
      {
        label: "<ignore>",
        list: []
      },
      {
        label: "#ignore",
        list: []
      },
      {
        label: "<include>",
      },
      {
        label: "<inject>",
        list: []
      },
      {
        label: "<log>",
        list: []
      },
      {
        label: "PartialFile",
        list: []
      },
      {
        label: "#repeat",
        list: []
      },
      {
        label: "<script>",
        list: []
      },
      {
        label: "<style>",
        list: []
      },
      {
        label: "transform",
        list: []
      },
      {
        label: "<variable>",
        list: []
      },
    ]
  },
}