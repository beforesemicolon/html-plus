const docLink = '/documentation';
const routesLink = '/documentation/routes';
const dataLink = '/documentation/data';
const templatingLink = '/documentation/templating';
const stylingLink = '/documentation/styling';
const scriptingLink = '/documentation/scripting';
const faqLink = '/documentation/faq';

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
          <h3>Create Your Project</h3>
          <p>You can create your node project how you normally do by using some tool or executing the following commands:</p>
          <code-snippet>
          mkdir my-app
          cd my-app
          npm init
          </code-snippet>
          <h3>Installation</h3>
          <p>Inside your project you can proceed to install <strong>HTML+</strong> and express:</p>
          <code-snippet>
          npm install express
          npm install @beforesemicolon/html-plus
          </code-snippet>
          <h3>Server Setup</h3>
          <p>The simplest setup you can have is importing <strong>HTML+</strong>, create your express app to pass it to
          the engine along with the directory where you will put the html page files.</p>
          <p><strong>HTML+ engine</strong> will setup your <a href="${docLink}/routing">Routes</a> and all handlers for
          CSS(including preprocessors), Javascript and Typescript.</p>
          <code-snippet type="js">
            const express = require('express');
            const http = require('http');
            const path = require('path');
            const {engine} = require('@beforesemicolon/html-plus');
      
            const app = express();
      
            engine(app, path.resolve(__dirname, './pages'));
      
            const server = http.createServer(app);
      
            server.listen(3000)
          </code-snippet>
          <footer>
            <p><strong>Next:</strong> <a href="${docLink}/routes">Routes</a></p>
          </footer>
        `,
      },
      {
        label: "Routes",
        path: `${routesLink}`,
        content: ``,
        list: [
          {
            label: "Pages",
            path: `${routesLink}/pages`,
            content: ``
          },
          {
            label: "Express Routes",
            path: `${routesLink}/express-routes`,
            content: ``
          },
        ],
      },
      {
        label: "Data",
        path: `${dataLink}`,
        content: ``,
        list: [
          {
            label: "Static Data",
            path: `${dataLink}/static-data`,
            content: ``
          },
          {
            label: "Dynamic Data",
            path: `${dataLink}/dynamic-data`,
            content: ``
          },
          {
            label: "Context Data",
            path: `${dataLink}/context-data`,
            content: ``
          }
        ]
      },
      {
        label: "Templating",
        path: `${templatingLink}`,
        content: ``,
        list: [
          {
            label: "Partials and Include",
            path: `${templatingLink}/partials-and-include`,
            content: ``
          },
          {
            label: "Inject HTML",
            path: `${templatingLink}/inject-html`,
            content: ``
          },
          {
            label: "Conditional Rendering",
            path: `${templatingLink}/conditional-rendering`,
            content: ``
          },
          {
            label: "Repeating Markup",
            path: `${templatingLink}/repeating-markup`,
            content: ``
          },
          {
            label: "Fragments & Ignore",
            path: `${templatingLink}/fragments-and-ignore`,
            content: ``
          },
        ]
      },
      {
        label: "Styling",
        path: `${stylingLink}`,
        content: ``
      },
      {
        label: "Scripting",
        path: `${scriptingLink}`,
        content: ``
      },
      {
        label: "FAQ",
        path: `${faqLink}`,
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