const docLink = '/documentation'

module.exports = {
  path: "/documentation",
  title: "HTML+ Documentation",
  searchLabel: 'Search...',
  content: `
    <h2>Welcome</h2>
    <p>The <strong>HTML+</strong> documentation will help you understand it in details and as always,
    it is better if you learn by doing by following the <a href="/learn" class="link-button secondary">learn</a>
    step by step project tutorial.</p>
    <p>You can also watch our essential training tutorial on <a href="">Before Semicolon Youtube Page</a>
    and subscribe for real world project building examples.</p>
    <a href="/documentation/getting-started" class="link-button cta">Get Started</a>
  `,
  docs_menu: {
    title: 'Documentation',
    list: [
      {
        label: "Getting Started",
        path: `${docLink}/getting-started`,
        content: `
          <p>With <strong>HTML+</strong> you can write smaller and more powerful HTML using it as template language
          and with the power of the engine, it can manage all pages and resources connected to the pages like CSS and
          Typescript so you can write the most modern code you can.</p>
          <p>When you are <em>ready to deploy</em>, it comes with a static site builder to build your project for production
          or you can simply continue to use live for a dynamic website with all batteries included.</p>
          <h3>Requirements</h3>
          <ul>
            <li><a href="https://nodejs.org/en/">Node</a> 10 or later</li>
            <li>Any OS that NodeJs can run</li>
            <li><a href="https://expressjs.com/">Express</a> 4 or later</li>
          </ul>
          <h3>Installation</h3>
          <h3>Create Your Project</h3>
          <h3>Server Setup</h3>
          <footer>
            <p>Next: <a href="${docLink}/routing">Routing</a></p>
          </footer>
        `,
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