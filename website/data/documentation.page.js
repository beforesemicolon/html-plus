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
        content: `
          <p><strong>HTML+ engine</strong> by default will use your pages file structure to create your site routes.</p>
          <p>This means that all you have to do is organize your <a href="${routesLink}/pages">HTML page</a> files
          in a manner it reflects the routes you want by grouping and nesting files.</p>
          <code-snippet>
            # File Structrure           # Routes

            - server.js
            - pages
              - index.html              /
              - contact.html            /contact
              - about.html              /about
              - 404.html                /404
              - projects
                - index.html            /projects
                - todo-project.html     /projects/todo-project
          </code-snippet>
          <footer>
            <p><strong>Next:</strong> <a href="${routesLink}/pages">Pages</a></p>
            <p><strong>Prev:</strong> <a href="${docLink}/getting-started">Getting Started</a></p>
          </footer>
        `,
        list: [
          {
            label: "Pages",
            path: `${routesLink}/pages`,
            content: `
            <p>To create pages you must first specify in which directory relative to the server you will be placing
            your HTML pages.</p>
            <code-snippet type="js">
              const {engine} = require('@beforesemicolon/html-plus');
        
              const app = express();
              
              engine(app, path.resolve(__dirname, './pages'));
            </code-snippet>
            <p>Once you have your pages directory, which you can name anything you want, you can start creating
            HTML files which will be used as pages.</p>
            <p>As mentioned in <a href="${routesLink}">routes</a>, the way you strucuture your pages directory files
            is how you want your routes. <strong>There are a few things you should know when doing so:</strong></p>
            <ul>
               <li><strong>index.html</strong> corresponds to <em>"/"</em> path or the path of the directory
               it is placed inside. So placing <em>index.html</em> at the root pages directory will match path "/" and
               placing in, for example, projects directory will match <em>"/projects"</em> path.</li>
               <li>Any html file name that starts with <em>"underscore"</em> will be seen as a partial file. No path will match such files.
               Use this rule to <a href="${templatingLink}/partials-and-include">create partials</a> that you can include in your page files.</li>
               <li>By default, <em>"/404"</em> will have a default page. You can override this by simply creating
               a <em>404.html</em> file at the root pages directory.</li>
               <li>Any html file inside the pages directory will be used instead of
                  <a href="${routesLink}/express-routes">express custom routes</a> your create.</li>
               <li>Every file will match a single route and any html page can be used as template for different routes
               if you setup the page in your <a href="${routesLink}/express-routes">express custom route</a> you create.</li>
            </ul>
            <code-snippet>
            # File Structrure           # Routes

            - server.js
            - pages
              - index.html              /
              - contact.html            /contact
              - about.html              /about
              - 404.html                /404
              - projects
                - index.html            /projects
                - todo-project.html     /projects/todo-project
          </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${routesLink}/reuse-pages">Reuse Pages</a></p>
              <p><strong>Prev:</strong> <a href="${routesLink}">Routes</a></p>
            </footer>
            `
          },
          {
            label: "Reuse Pages",
            path: `${routesLink}/reuse-pages`,
            content: `
              <p>Sometimes you may want to use the same page template for different routes. For example,
              all document pages you read under the /documentation path of this website uses the same template.</p>
              <p>Because each HTML file can only correspond to a single route path you need to setup
              a dynamic express route to serve the sample template you want.</p>
              <code-snippet type="js">
                const {engine} = require('@beforesemicolon/html-plus');
          
                const app = express();
                
                engine(app, path.resolve(__dirname, './pages'));
                
                app.get('/documentation/:doc?', (req, res) => {
                    res.render('documentation', {some: "data"})
                });
                
              </code-snippet>
              <p>When you call the <em>render</em> method in the express response object, you don't need the initial
              forward-slash or to indicate the file extension. Every name of file you specify is know to be under the
              pages directory path you provided.</p>
              <p>This is also a nice way to pass specific data per route as you will learn more about
              when you explore <a href="${dataLink}">how data works with templates.</a></p>
              <h3>Deep nested template files</h3>
              <p>You can refer to deeply nested templates using the forward-slash to indicate nested template file.</p>
              <code-snippet type="js">
                app.get('/projects/:projectName', (req, res) => {
                    res.render(\`project/custom/\${req.params.projectName}\`)
                });
                
              </code-snippet>
              <footer>
                <p><strong>Next:</strong> <a href="${dataLink}">Data</a></p>
                <p><strong>Prev:</strong> <a href="${routesLink}/pages">Pages</a></p>
              </footer>
            `
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
          {
            label: "Debuging",
            path: `${templatingLink}/debuging`,
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