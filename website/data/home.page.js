module.exports = {
  path: "/",
  title: "HTML+ - HTML template language, engine and site builder",
  description: "HTML+ - HTML template language, engine and site builder",
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
    description: "In short, it is familiar, fast, powerful and allows you to write less and powerfully. Here is more:",
    link_label: "learn more",
    list: [
      {
        title: "It is just HTML",
        description: "There is no weird syntax. You already know this language.",
        path: "/documenation#just-html"
      },
      {
        title: "Simple and small list of tags and attributes",
        description: "There are only few new tags and attributes to learn and they still look like HTML.",
        path: "/documenation#tags-and-attributes"
      },
      {
        title: "Powerful data binding and data contextualization",
        description: "It allows you to reference data in separate files and create data context for specific parts of the page.",
        path: "/documenation#data-bind-and-context"
      },
      {
        title: "Create your custom HTML tags and attributes",
        description: "You can create custom tags and attributes to handle a specific situation of your project. It is like <abbr title=\"Server Side Rendering\">SSR</abbr> components.",
        path: "/documenation#custom-tags-and-attributes"
      },
      {
        title: "Support for typescript, CSS pre and post-processors",
        description: "Simply link or write your SASS, LESS, Typescript and more",
        path: "/documenation#css-processors-and-typescript-support"
      },
      {
        title: "Write Future CSS",
        description: "<a href=\"/documenation#engine\">HTML+ engine</a> allows you to write future and safe CSS that works in any browser",
        path: "/documenation#write-future-CSS"
      },
      {
        title: "Static and Dynamic <abbr title=\"Server Side Rendering\">SSR</abbr> website",
        description: "Create faster website by rendering on the Server with static or dynamic pages.",
        path: "/documenation#static-and-dynamic-website"
      },
      {
        title: "A site builder",
        description: "<a href=\"/documenation#site-builder\">HTML+ builder</a> takes care of exporting production ready site files to be hosted anywhere.",
        path: "/documenation#site-builder"
      },
      {
        title: "Page file directory as route",
        description: "You can creat your website router by simply using the pages file structure. The rest is taken care by the engine.",
        path: "/documenation#page-structure-route"
      },
      {
        title: "Generates optimal code for production",
        description: "The site builder will only export optimal and needed CSS, Javascript and HTML for production.",
        path: "/documenation#production-optimization"
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