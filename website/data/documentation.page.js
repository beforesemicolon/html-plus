const docLink = '/documentation'

module.exports = {
  currentPath: "/documentation",
  title: "HTML+ Documentation",
  searchTerm: 'Search...',
  'docs-menu': {
    title: 'Documentation',
    list: [
      {
        label: "Getting Started",
        page: "getting-started",
        path: `${docLink}/${this.page}`,
        list: []
      },
      {
        label: "Routing",
        list: []
      },
      {
        label: "Data",
        list: []
      },
      {
        label: "Data Context",
        list: []
      },
      {
        label: "Templating",
        list: []
      },
      {
        label: "Styling",
        list: []
      },
      {
        label: "Scripting",
        list: []
      },
      {
        label: "Create Custom Tag",
        list: []
      },
      {
        label: "Create Custom Attribute",
        list: []
      },
      {
        label: "FAQ",
        page: "getting-started",
        path: `${docLink}/${this.page}`,
      },
    ]
  },
  'api-menu': {
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