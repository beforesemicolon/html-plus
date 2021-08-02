const site = require('./site.json');

module.exports = {
  path: "/",
  title: "HTML Plus",
  description: `HTML Plus - ${site.description}`,
  banner: {
    description: "HTML is powerful on its own and there is no need to change its syntax. <strong>HTML+</strong> simply\n\t\tadds and allows you to add extra capabilities while still enjoying the HTML syntax.",
    links: [
       {
          path: "/learn",
          label: "Start Learning"
        },
        {
          path: "/documentation",
          label: "Documentation"
        }
    ],
  },
  features: {
    title: "Why HTML+?",
    description: "In short, it is familiar, fast, simple and allows you to write less and powerfully. Here is more:",
    link_label: "learn more",
    list: [
      {
        title: "It is just HTML",
        description: "The syntax is of HTML so you already know this language.",
        path: "/documentation/getting-started",
        partial: "just-html"
      },
      {
        title: "Small learning curve",
        description: "There are only few new tags and attributes with amazing capabilities to learn about.",
        path: "/documentation/templating",
        partial: "attributes-tags"
      },
      {
        title: "Support for SASS, LESS, STYLUS and Typescript out of the box",
        description: "Simply link your SASS, LESS, STYLUS and Typescript files.",
        path: "/documentation/styling",
        partial: "support"
      },
      {
        title: "Write Future CSS",
        description: "<a href=\"/documentation/api-reference/engine-function\">HTML+ engine</a> allows you to write modern CSS that works in any browser.",
        path: "/documentation/styling/modern-css",
        partial: "future-css"
      },
      {
        title: "Powerful data binding and data contextualization",
        description: "It allows you to reference data in separate files and create data context for specific parts of the page.",
        path: "/documentation/template-data-binding",
        partial: "data-binding"
      },
      {
        title: "Create your custom HTML tags and attributes",
        description: "You can create custom tags and attributes to handle a specific situation of your project.",
        path: "/documentation/advanced-templating/custom-tags",
        partial: "custom-tag"
      },
      {
        title: "Static and Dynamic <abbr title=\"Server Side Rendering\">SSR</abbr> website",
        description: "Create faster website by rendering on the Server with static or dynamic pages.",
        path: "/documentation/routes",
        partial: ""
      },
      {
        title: "A site builder",
        description: "<a href=\"/documentation/build\">HTML+ builder</a> takes care of exporting production ready site files to be hosted anywhere.",
        path: "/documentation/build",
        partial: ""
      },
      {
        title: "Page file directory as route",
        description: "You can creat your website router by simply using the pages file structure. The rest is taken care by the engine.",
        path: "/documentation/routes/pages",
        partial: ""
      },
      {
        title: "Generates optimal code for production",
        description: "The site builder will only export optimal and needed CSS, Javascript and HTML for production.",
        path: "/documentation/build",
        partial: ""
      }
    ]
  },
  quick_start: {
    title: "Get Started Quickly",
    description: "The following code creates an Express server with template, page routes, CSS(pre and post processors) and Typescript files setup ready to go.",
    link: {
      title: "Quick Start",
      path: "/learn"
    }
  }
};
