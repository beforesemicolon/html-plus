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
  label: "Welcome",
  description: "HTML+ - HTML template language, engine and site builder",
  searchLabel: 'Search...',
  content: `
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
        content: `
          <p><strong>HTML+</strong> templates can be made fully aware of your data files and injecting or creating
          context data is super easy to do either inside the template itself or the initial configuration.</p>
          <p>Another spetacular aspect of the data is that it can be contextualized and there is no need to
          keep passing data to partial files when you include them.</p>
          <p>Data can be provided or created in few ways:</p>
          <ul>
            <li><a href="${dataLink}/static-data"><strong>Through initial engine configuration</strong></a>: This is great for when you want to fetch data from database when
            server starts and make it available inside templates.</li>
            <li><a href="${dataLink}/dynamic-data"><strong>On every page request</strong></a>: This is particular great
            when you want to inject data specific to that template or something from the request made like form data or uploaded
            file details.</li>
            <li><a href="${dataLink}/context-data"><strong>On includes and with local scoped variables</strong></a>: This
            is great when you wan for a specific part of the template to have a unique sample of the data and even
            override to global data provided.</li>
          </ul>
          <p>With <strong>HTML+</strong> templates, data can be global and scoped(context) which allows for unique templates
          to be build to fit the exact need you have.</p>
          <p>The templates are built in a way to enforce data imutability. This is so when you override data in one
          template will never affect how data is in another.</p>
          <footer>
            <p><strong>Next:</strong> <a href="${dataLink}/static-data">Static Data</a></p>
            <p><strong>Prev:</strong> <a href="${routesLink}/reuse-pages">Reuse Pages</a></p>
          </footer>
        `,
        list: [
          {
            label: "Static Data",
            path: `${dataLink}/static-data`,
            content: `
            <p>Static data is any data you provide through the initial engine configuration when the server runs.</p>
            <p>This data is kept unchanged and every template file is given access to it.</p>
            <code-snippet type="js">
            const {engine} = require('@beforesemicolon/html-plus');
            
            const app = express();
            
            engine(app, path.resolve(__dirname, './pages'), {
              staticData: {
                site: {
                  version: "2.4.1",
                  license: "MIT"
                }
              }
            });
            </code-snippet>
            <p>Inside the template you can reference this data by using <strong>$data</strong> variable.</p>
            <code-snippet type="html">
              <header><h1>HTML+</h1> <p>version {$data.site.version}, license {$data.site.license}</p></header>
            </code-snippet>
            <p>Static data is an excellent place to provide data fetched from databases or somewhere in the cloud when
            server is starting. Any data can be made available to all templates using the <a href="">staticData</a>
            engine option.</p>
            <footer>
              <p><strong>Next:</strong> <a href="${dataLink}/dynamic-data">Dynamic Data</a></p>
              <p><strong>Prev:</strong> <a href="${dataLink}">Data</a></p>
            </footer>
            `
          },
          {
            label: "Dynamic Data",
            path: `${dataLink}/dynamic-data`,
            content: `
            <p>There are two ways you can pass data dynamically to the templates on every page request:</p>
            <ul>
                <li><a href="#on-page-request">onPageRequest engine option</a></li>
                <li><a href="#on-express-route-request">On custom express route page request</a></li>
            </ul>
            <h3 id="on-page-request">On Page Request</h3>
            <p>One of the <a href="">engine</a> options is the <a href="">onPageRequest</a> which must be a function
            that is called on every page request with the <a href="http://expressjs.com/en/api.html#req">express request object</a>
            and must return an object to be used as the data in the template.</p>
            <code-snippet type="js">
            const {engine} = require('@beforesemicolon/html-plus');
            
            const app = express();
            
            engine(app, path.resolve(__dirname, './pages'), {
              onPageRequest: (req) => {
                return {
                  path: req.path,
                  params: req.params
                }
              }
            });
            </code-snippet>
            <p>This data can be accessed inside the template using the <strong>$data</strong> variable.</p>
            <h3 id="on-express-route-request">On Express Route Request</h3>
            <p>You can also setup dynamic custom routes to handle page requests which will give you the opportunity
             to call the <a href="">express response render method</a> to render a particular template.</p>
            <p>This render method also takes a second argument which is the object data to be passed to the
            template.</p>
            <code-snippet type="js">
                app.get('/projects/:projectName', (req, res) => {
                    res.render(\`project/custom/\${req.params.projectName}\`, {
                        params: req.params,
                        title: 'Projects'
                    })
                });
            </code-snippet>
            <p>Both options to inject data into templates are great ways to collect data from any data storage source
            and handle it right inside the templates so it is composed right inside the templates.</p>
            <footer>
              <p><strong>Next:</strong> <a href="${dataLink}/context-data">Context Data</a></p>
              <p><strong>Prev:</strong> <a href="${dataLink}/static-data">Static Data</a></p>
            </footer>
            `
          },
          {
            label: "Context Data",
            path: `${dataLink}/context-data`,
            content: `
            <p>Every page template is its own context. Any additional data created inside the template is made available
            deeply even inside included partials.</p>
            <p>You can create <a href="">variables</a> which value can only
            be accessed after declaration and inside the tag it was declared at.</p>
            <code-snippet type="html">
              <main>
                <!-- cant access "page" before declaration  -->
                <variable name="page"
                        value="$data.pages.documentation"></variable>
                <h3>{page.title}</h3>
                <p>{page.description}</p>
              </main>
              <!-- cant access "page" outside the tag it was declared at -->
            </code-snippet>
            <p>Variables declare at the beginning of the template is available everywhere inside the template, even
            inside the partials you include in your template.</p>
            <code-snippet type="html">
              <variable name="page"
                        value="$data.pages.documentation"></variable>
              <main>
                <h3>{page.title}</h3>
                <p>{page.description}</p>
                <!-- page can be referenced inside the "products" partial template -->
                <include partial="products"></include>
              </main>
            </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}">Templating</a></p>
              <p><strong>Prev:</strong> <a href="${dataLink}/dynamic-data">Dynamic Data</a></p>
            </footer>
            `
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