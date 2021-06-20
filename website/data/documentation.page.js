const docLink = '/documentation';
const routesLink = '/documentation/routes';
const dataLink = '/documentation/data';
const templatingDataBindingLink = '/documentation/template-data-binding';
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
        label: "Template data binding",
        path: `${templatingDataBindingLink}`,
        content: `
            <p><strong>HTML+</strong> uses curly braces to indicate mark the data you want to bind to the template.</p>
            <code-snippet type="html">
                <button type="{type}">{label}</button>
            </code-snippet>
            <p>This syntax work for attributes as well it is a simple way to mark the variable which can also contain logic.</p>
            <code-snippet type="html">
                <button type="{type}">{type === 'button' ? 'Send' : 'Submit'}</button>
            </code-snippet>
            <p>You may also contactinate these curly braces to form a string you want.</p>
            <code-snippet type="html">
                <button type="button">{label} Button</button>
            </code-snippet>
            <p>You <strong>don't need to use curly braces</strong> for any <strong>HTML+</strong> <a href="">default attributes</a>
            and don't need it also for some attributes specific to a <strong>HTML+</strong> <a href="">default attributes</a></p>
            <p>because the curly braces has meaning for <strong>HTML+</strong> you should escape it or use correct
            HTML entity for it.</p>
            <code-snippet type="html">
                <button type="button">Save \{Button\}</button>
            </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}">Templating</a></p>
              <p><strong>Prev:</strong> <a href="${dataLink}/context-data">Context Data</a></p>
            </footer>`
      },
      {
        label: "Templating",
        path: `${templatingLink}`,
        content: `
        <p>The whole point of a template language is to simplify things and for <strong>HTML+</strong> it is all about
        writing less and making it reusable.</p>
        <p>There are many ways to make templates small and reusable and <strong>HTML+</strong> has few new and common
        features to do just that.</p>
        <ul>
            <li><a href=""><strong>Partials</strong></a> allow you to split your template into small reusable parts and
            include them in different templates.</li>
            <li><a href=""><strong>Template Injection</strong></a> allows you to inject markup inside partials so they
            can be dynamic and look different case by case while stil reusable.</li>
            <li><a href=""><strong>Condional render</strong></a> is important in defining what parts of the template
            should be sent to the browser depending on some logic in the template.</li>
            <li><a href=""><strong>Repetion</strong></a> makes your template smaller and capable of hanlding long list
            of data that would be tedious to type and only focus on the data that causes the repetion in the template.</li>
            <li><a href=""><strong>Variables</strong></a> are a powerful way to create local data, define reusable
            data as well as compacting logic that may croud the template tags.</li>
            <li><a href=""><strong>Framents</strong></a> are the simplest way to group tags either for repetion or logic
            without having to wrap them in a HTML tag.</li>
            <li><a href=""><strong>Customization</strong></a> is the most powerful aspect of templating. <strong>HTML+</strong>
            allows you to create your own attributes and tags to take care of complex logic and calculation you can't
            do inside the templates</li>
            <li><a href=""><strong>Debugging</strong></a> when you have powerful templates it only makes sense to
            be able to debug it efficiently and <strong>HTML+</strong> helps you with that with specific error messages
            and a way to log you template logic.</li>
        </ul>
        <p>All these features make <strong>HTML+</strong> a unique template language to write powerful pages.
        The best feature of all is that it is all HTML, no additional markup to create your templates. It should
        feel super familiar.</p>
        <footer>
          <p><strong>Next:</strong> <a href="${templatingLink}/partials-and-include">Partials and Include</a></p>
          <p><strong>Prev:</strong> <a href="${dataLink}/context-data">Context Data</a></p>
        </footer>
        `,
        list: [
          {
            label: "Partials and Include",
            path: `${templatingLink}/partials-and-include`,
            content: `
            <p>Partials are simply a way to split your templates into parts that can be reused in different templates.</p>
            <h3>Create Partials</h3>
            <p>To create a partial files all you have to do is create an HTML file which the name starts with an underscore.</p>
            <code-snippet highligh="_layout.html, _header.html">
              # File Structrure           # Routes
  
              - server.js
              - pages
                - partials
                  - _layout.html
                  - _header.html
                - index.html              /
                - contact.html            /contact
                - about.html              /about
                - 404.html                /404
                - projects
                  - index.html            /projects
                  - todo-project.html     /projects/todo-project
            </code-snippet>
            <p>Partial files are ignored by the routes and can only be included in a page templates.</p>
            <h3>Include partials</h3>
            <p>To include a partial in your page template you must use the <a href="">include tag</a>.</p>
            <code-snippet type="html">
              <!-- _header.html  -->
              <header>
                <h1>Projects</h1>
                <p class="description">Welcome to the projects page</p>
              </header>
            </code-snippet>
            <p>The <a href="">include</a> tag takes the name of the partial file (without underscore and extension)
            as the value of the <a href="">partial attribute</a> and will include the partial file content in your template.</p>
            <code-snippet type="html">
              <!-- project.html  -->
              <include partial="header"></include>
            </code-snippet>
            <p>This means that <strong>partial file names must be unique</strong> and they can be placed anywhere inside
            your pages directory.</p>
            <p>You can also use the <a href="">partial-path attribute</a> to include another template or partial file.</p>
             <code-snippet type="html">
              <!-- project.html  -->
              <include partial="header"></include>
              <include partial-path="../content.html"></include>
            </code-snippet>
            <p>When using the <a href="">partial-path attribute</a> the file you include does not have to be a partial file
            which means the file name may not need to start with an underscore.</p>
            <h3>Partials data and context</h3>
            <p>Our partial file example above has hardcoded title and description which does not make it reusable.</p>
            <p>We can use <a href="">template binding</a> to expect a value for the title and description so it can be set
            to match the pages it is included at.</p>
            <code-snippet type="html">
              <!-- _header.html  -->
              <header>
                <h1>{title}</h1>
                <p class="description">{description}</p>
              </header>
            </code-snippet>
            <p>By default partial files inherit the context of the template file they are include in.</p>
            <p>By declaring the title and description in our project template it will automatically be inherited
            by the partial included after the declaration.</p>
            <code-snippet type="html">
              <!-- project.html  -->
              <variable name="title">Projects</variable>
              <variable name="description">Welcome to the projects page</variable>
              <include partial="header"></include>
            </code-snippet>
            <p>Creating variable solely to be inherited by the partial may not be a good option because it is not
            obvious that the declaration is needed by the partial.</p>
            <p>To make it more explicit, the <a href="">include tag</a> takes context data for the partial as data attribute
            value which the value must be a Javascript object literal.</p>
            <code-snippet type="html">
              <!-- project.html  -->
              <include partial="header"
                       data="{title: 'Projects', description: 'Welcome to the projects page'}"></include>
            </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}/inject-html">Inject HTML</a></p>
              <p><strong>Prev:</strong> <a href="${templatingLink}">Templating</a></p>
            </footer>
            `
          },
          {
            label: "Inject HTML",
            path: `${templatingLink}/inject-html`,
            content: `
            <p>The <a href="">inject tag</a> is a powerful tag that when used inside partial files. It is a
             placeholder tag much like the HTML <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot">slot tag</a>.
            </p>
            <h3>Inject any markup</h3>
            <p>Simply adding a <a href="">inject tag</a> inside a partial file means that any content you put
            inside the <a href="">include tag</a> will be injected at that spot.</p>
            <code-snippet type="html">
              <!-- _header.html  -->
              <header>
                <h1>{title}</h1>
                <p class="description">{description}</p>
                <inject></inject>
              </header>
            </code-snippet>
            <code-snippet type="html">
              <!-- project.html  -->
              <include partial="header"
                       data="{title: 'Projects', description: 'Welcome to the projects page'}">
                <nav>
                   <a href="/project-1">Project 1</a>
                   <a href="/project-2">Project 2</a>
                   <a href="/project-3">Project 3</a>
                </nav>
              </include>
            </code-snippet>
            <p>The above project template will look like this:</p>
            <code-snippet type="html">
              <!-- project.html  -->
              <h1>Projects</h1>
              <p class="description">Welcome to the projects page</p>
              <nav>
                 <a href="/project-1">Project 1</a>
                 <a href="/project-2">Project 2</a>
                 <a href="/project-3">Project 3</a>
              </nav>
            </code-snippet>
            <p>As you can see, any markup you put inside <a href="">include tag</a> is content to be injected inside
            the partial.</p>
            <h3>Inject specific markup</h3>
            <p>You can be more specific of what type of content must be inject if you specify an id.</p>
            <p>Take the following layout template</p>
            <code-snippet type="html">
              <!-- _layout.html  -->
              <!doctype html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <inject id="style"></inject>
              </head>
              <body>
                <inject></inject>
                <inject id="script"></inject>
              </body>
              </html>
            </code-snippet>
            <p>When including this template we can specify the part to match the inject tags. That is done by adding the
            <a href="">inject-id</a> attribute on the tag you want to match the inject tag id.</p>
            <code-snippet type="html">
              <!-- index.html  -->
              <include partial="layout">
                <link rel="stylesheet" href="style.scss" inject-id="style">
                <h1>Welcome!</h1>
                <script src="app.ts" inject-id="script"></script>
              </include>
            </code-snippet>
            <p>The above index.html template will resolve to be:</p>
            <code-snippet type="html">
              <!-- index.html  -->
              <!doctype html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Document</title>
                <link rel="stylesheet" href="style.scss">
              </head>
              <body>
                <h1>Welcome!</h1>
                <script src="app.ts"></script>
              </body>
              </html>
            </code-snippet>
            <h3>Default Content</h3>
            <p>You can also specify a default content to be used in case the include tag contain no inner HTML.</p>
            <code-snippet type="html">
              <!-- _search-results.html  -->
              <section class="searh-results">
                <h2>Search results for "{searchTerm}"</h2>
                <inject>
                    <p>No Results matched your search</p>
                </inject>
              </section>
            </code-snippet>
            <p>The above search results partial will show a paragraph tag with "No Results matched your search" text
            if the include tag resolves to have empty content.</p>
            <code-snippet type="html">
              <!-- search.html  -->
              <include partial="search-results" data="{searchTerm: term}">
                <div #if="results.length" #repeat="results">
                   <h3>{$item.title}</h3>
                   <p>{$item.description}</p>
                </div>
              </include>
            </code-snippet>
            <h3>Inject markup from variables</h3>
            <p>Another thing the <a href="">inject tag</a> can do for you is allow you to inject HTML markup that probably
            is store in a data variable.</p>
            <p>You can always use template data binding to inject HTML into your template but if this markup is a HTML+
            markup nothing will compiled.</p>
            <code-snippet type="html">
              <!-- blog.html  -->
              <article>
                <h2>{$data.article.title}</h2>
                {$data.article.body}
              </article>
            </code-snippet>
            <p>The above example will show the HTML as is without compiling and if the HTML happens to be HTML+
            the tags and attributes specific to it will not be compiled</p>
            <p>The below example is better if you want the HTML+ markup to be compiled.</p>
            <code-snippet type="html">
              <!-- blog.html  -->
              <article>
                <h2>{$data.article.title}</h2>
                <inject html="$data.article.body"></inject>
              </article>
            </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}/conditional-rendering">Conditional Rendering</a></p>
              <p><strong>Prev:</strong> <a href="${templatingLink}/partials-and-include">Partials and Include</a></p>
            </footer>
            `
          },
          {
            label: "Conditional Rendering",
            path: `${templatingLink}/conditional-rendering`,
            content: `
            <p>Conditional rendering is all about relying on some information or logic to decide whether
            a part of the template or a specific attribute should be shipped to the browser or not.</p>
            <h3>The #if attribute</h3>
            <p>The <a href="">#if attribute</a> allows you to specify a condition that decides if the tag
            should be rendered or not.</p>
            <code-snippet type="html" hightlight="#if">
                <variable name="x" value="10"></variable>
                <variable name="y" value="5"></variable>
                
                <div #if="x > y">x greater than y</div>
                <div #if="x < y">x less than y</div>
                <div #if="x === y">x equals to y</div>
            </code-snippet>
            <h3>The #attr attribute</h3>
            <p>There are some attributes you may want to be include only certain condition and that is what the
            <a href="">#attr attribute</a> is for.</p>
            <p>You use comma to separate the attribue name, value and the condition to include it where the value
            is optional for boolead attributes like "hidden", "disabled<", "checked", etc.</p>
            <code-snippet type="html" hightlight="#attr">
                <variable name="saved" value="true"></variable>
                
                <div class="save-indicator" #attr="class, readonly, saved">
                    <button type="button" #attr="disabled, saved">save</button>
                </div>
                <!-- becomes:
                <div class="save-indicator readonly">
                    <button type="button" disabled>save</button>
                </div>
                -->
            </code-snippet>
            <p>You may also specify multiple set of conditions separated by semicolon.</p>
            <code-snippet type="html" hightlight="#attr, ;">
                <variable name="saved" value="true"></variable>
                
                <button type="button" #attr="disabled, saved; class, readonly, saved">save</button>
                <!-- becomes: <button type="button" class="readonly" disabled>save</button>  -->
            </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}/repeating-markup">Repeating Markup</a></p>
              <p><strong>Prev:</strong> <a href="${templatingLink}/inject-html">Inject HTML</a></p>
            </footer>
            `
          },
          {
            label: "Repeating Markup",
            path: `${templatingLink}/repeating-markup`,
            content: `
            <p>Making parts of the markup repeat for a list or certain times is always needed in templates in order
            to save the typing and only manipulate the data. <strong>HTML+</strong> allows you to do that using the
            <a href="">#repeat attribute</a> which comes with extra magic.</p>
            <h3>Repeat specific number of times</h3>
            <p>You can repeat a markup for a specific number of times.</p>
            <code-snippet type="html">
                <button><span #repeat="3">*</span></button>
                <!-- becomes: <button><span>*</span><span>*</span><span>*</span></button>  -->
            </code-snippet>
            <h3>The $item, $key and $index variables</h3>
            <p>The <a href="">#repeat attribute</a> creates three variables for you as context for the markup you
            are repeating. These are:</p>
            <ul>
               <li><a href="">$item</a>: contains the value of the item of the list</li>
               <li><a href="">$key</a> contains the key or index value of the item in the list or dictionary</li>
               <li><a href="">$index</a> contains the index of the item in the list</li>
            </ul>
            <code-snippet type="html">
                <ul>
                   <li #repeat="3" class="list-item-{$index}">Item {$item}</li>
                </ul>
                <!-- becomes:
                <ul>
                   <li class="list-item-0">Item 1</li>
                   <li class="list-item-1">Item 2</li>
                   <li class="list-item-2">Item 3</li>
                </ul>
                -->
            </code-snippet>
            <h3>Repeat for a list or dictionary</h3>
            <p>The <a href="">#repeat</a> attribute can also take list-like-objects like Javascript Array and Set
            as well as dictionaries like Javascript Map and Object.</p>
            <code-snippet type="html">
                <div #repeat="[2, 4, 6]">{$index}-{$item}</div>
                <div #repeat="new Set([2, 4, 6])">{$item}</div>
                <div #repeat="new Map([[a,2], [b,4], [c,6]])">{$key}-{$item}</div>
                <div #repeat="{a: 2, b: 4, c: 6}">{$key}-{$item}</div>
                <div #repeat="$data.list">$item.name</div>
            </code-snippet>
            <h3>Repeat as</h3>
            <p>By default, all item value is available under the <a href="">$item</a> variable but you can also
            override it by specifying the <strong>as</strong> value</p>
            <code-snippet type="html">
                <nav>
                   <a #repeat="navLinks as link" href="{link.path}">{link.label}</a>
                </nav>
                <!-- becomes:
                <nav>
                   <a href="/">Home</a>
                   <a href="/about">About</a>
                   <a href="/contact">Contact</a>
                </nav>
                -->
            </code-snippet>
            <p>It also works for numeric repeats.</p>
            <code-snippet type="html">
                <ul>
                   <li #repeat="3 as n" class="list-item-{$index}">Item {n}</li>
                </ul>
                <!-- becomes:
                <ul>
                   <li class="list-item-0">Item 1</li>
                   <li class="list-item-1">Item 2</li>
                   <li class="list-item-2">Item 3</li>
                </ul>
                -->
            </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}/variables">Variables</a></p>
              <p><strong>Prev:</strong> <a href="${templatingLink}/conditional-rendering">Conditional Rendering</a></p>
            </footer>`
          },
          {
            label: "Variables",
            path: `${templatingLink}/variables`,
            content: `
            <p><a href="">Variable tag</a> is one of the ways to create <a href="">scope data</a>.</p>
            <p>When it comes to templating, variables help with reusing logic and piece of data to clean things
            a litle and make templates easier to understand.</p>
            <p>Instead of this:</p>
            <code-snippet type="html">
                <ul>
                    <li #repeat="$data.list.filter(n => n.price > 0)">{$item.name}</li>
                </ul>
                <p>Total price: {$data.list.filter(n => n.size > 10).reduce((acc, n) => n.price), 0)}</p>
            </code-snippet>
            <p>Do this:</p>
            <code-snippet type="html">
                <variable name="pricedList"
                          value="$data.list.filter(n => n.price > 0)"></variable>
                <ul>
                    <li #repeat="pricedList">{$item.name}</li>
                </ul>
                <variable name="total"
                          value="pricedList.reduce((acc, n) => n.price), 0)"></variable>
                <p>Total price: {total}</p>
            </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}/fragment-and-ignore">Fragment & Ignore</a></p>
              <p><strong>Prev:</strong> <a href="${templatingLink}/repeating-markup">Repeating Markup</a></p>
            </footer>`
          },
          {
            label: "Fragment & Ignore",
            path: `${templatingLink}/fragment-and-ignore`,
            content: `
            <p><strong>HTML+</strong> provides you with the <a href="">fragment tag</a> which is useful
            for when you dont need the wrapping tag and still want to apply logic like repeating and conditional
            rendering.</p>
            <code-snippet type="html">
                <fragment #if="user.isAdmin">
                    <section id="control-pannel">...</section>
                    <section id="user-manegement">...</section>
                </fragment>
            </code-snippet>
            <p>The above can also be accomplished with the <a href="">#fragment attribute</a>.</p>
            <code-snippet type="html">
                <div #fragment #if="user.isAdmin">
                    <section id="control-pannel">...</section>
                    <section id="user-manegement">...</section>
                </div>
            </code-snippet>
            <h3>Improve render time</h3>
            <p>Another very special tag and attribute is <a href="">ignore</a>. They pretty much signal to the
            compiler that the markup content does not need to be compiled and should be shown as is.</p>
            <code-snippet type="html">
                <ignore #if="user.isAdmin">
                    <section id="control-pannel">...</section>
                    <section id="user-manegement">...</section>
                </ignore>
            </code-snippet>
            <p>This can save compiling time and make your template render faster.</p>
            <code-snippet type="html">
                <div #ignore #if="user.isAdmin">
                    <section id="control-pannel">...</section>
                    <section id="user-manegement">...</section>
                </div>
            </code-snippet>
            <p>Both, fragment and ignore tag and attribute options, will render the inner content only but ignore
            will not compile the content.</p>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}/custom-tags-and-attributes">Custom tags and attributes</a></p>
              <p><strong>Prev:</strong> <a href="${templatingLink}/variables">Variables</a></p>
            </footer>`
          },
          {
            label: "Custom tags and attributes",
            path: `${templatingLink}/custom-tags-and-attributes`,
            content: `
            <p>The real power of <strong>HTML+</strong> is in its ability to create custom tags and attributes
            that can handle more complex logic and calculations.</p>
            <h3>Custom Tags</h3>
            <p>A custom tag can be a class or a function which must contain a or return a render function. And that's the
            ony rule.</p>
            <p>The below search field class will can be used as <strogn>search-field</strogn> tag. That means that how you
            name your class and function is how the tag name will be called.</p>
            <code-snippet type="js">
                class SearchField {
                    render() {
                        return \`
                        <label class="search-field" aria-label="search field">
                          <input type="search" name="search" placeholder="Search...">
                        </label>
                        \`;
                    }
                }
            </code-snippet>
            <p>After, it must be registered by passing it to the engine on start.</p>
            <code-snippet type="js">
              const {engine} = require('@beforesemicolon/html-plus');
              const {SearchField} = require('./SearchField.js');
        
              const app = express();
              
              engine(app, path.resolve(__dirname, './pages'), {
                customTags: [SearchField]
              });
            </code-snippet>
            <p>We can now used it our template as so.</p>
            <code-snippet type="html">
                <search-field></search-field>
            </code-snippet>
            <p>You may also pass attributes and custom tag and attribute will be initialized with two arguments. The
            <a href="">HTMLNode</a> object and the <a href="">options</a> the node was created with.</p>
            <p>To add accept a <em>value</em> and <em>placeholder</em> attribute we can use a constructor in our example.</p>
            <code-snippet type="js">
                class SearchField {
                    constructor(node, options) {
                        this.node = node;
                    }
                    
                    render() {
                        const {value = '', placeholder = 'Search...'} = this.node.attributes;
                        return \`
                          <label class="search-field" aria-label="search field">
                            <input type="search" name="search" placeholder="\${placeholder}" value="\${value}">
                          </label>
                        \`;
                    }
                }
            </code-snippet>
            <code-snippet type="html">
                <search-field value="sample" placeholder="Find..."></search-field>
            </code-snippet>
            <p>The node object will contain things like the <a href="">attributes</a>, <a href="">context</a> and
            other very useful <a href="">methods and properties</a>.</p>
            <p>The options object will contain things like the <a href="">data</a>, the <a href="">file object</a> and
            other <a href="">details</a>.</p>
            <h3>Custom Attributes</h3>
            <p>Custom attributes must all be a class that extends the <a href="">Attribute class</a>. This class must
            also contain a render method which is called the value of the attribute and the <a href="">HTMLNode</a> instance.</p>
            <p>A optional method of you custom attribute is the <a href="">process</a> method which is called with the value
            of the attribute which you can tweak into a different srting to be bind or executed before the rendering.</p>
            <p>The below <em>WrapWith</em> custom attribute will receive a comma separated name of tags and wrap
            the tag it is placed on with those.</p>
            <code-snippet type="js">
                const {Attribute} = request('@beforesemicolon/html-plus');
                
                class WrapWith extends Attribute {
                    process(value) {
                        this.tags = value.split(',');
                        
                        return value;
                    }
                    
                    render(value, node) {
                        return this.tags.reduce((content, tag) => {
                            return \`<\${tag}>\${content}</\${tag}>\`;
                        }, node.render());
                    }
                }
            </code-snippet>
            <p>With the class, we register it with the engine.</p>
            <code-snippet type="js">
              const {engine} = require('@beforesemicolon/html-plus');
              const {WrapWith} = require('./WrapWith.js');
        
              const app = express();
              
              engine(app, path.resolve(__dirname, './pages'), {
                customAttributes: [WrapWith]
              });
            </code-snippet>
            <p>We can now use it as such</p>
            <code-snippet type="html">
              <p #wrap-with="div">wrapped</p>
              <!-- becomes: <div><p>wrapped</p></div> -->
              <p #wrap-with="section,div">wrapped</p>
              <!-- becomes: <section><div><p>wrapped</p></div></section>-->
            </code-snippet>
            <blockquote><strong>Note:</strong> both, custom attributes and tags render function, must return the final html. This
            html must not contain any markup to be compiled.</blockquote>
            <h3>Custom Tag Custom Attributes</h3>
            <p>Your custom tags can also contain specific attributes. These attributes won't be marked with hash symbol(#).</p>
            <p>You may define them as a static property on a class or function.</p>
            <code-snippet type="js">
                const {Attribute} = request('@beforesemicolon/html-plus');
                
                class SearchField {
                    render() {
                        return \`
                        <label class="search-field" aria-label="search field">
                          <input type="search" name="search" placeholder="Search...">
                        </label>
                        \`;
                    }
                    
                    static get customAttributes() {
                        return {
                            value: new Attribute('value', '', false, true)
                        }
                    }
                }
            </code-snippet>
            <p>These custom attributes can be simple objects as well. Not necessary a Attribute instance unless you want
            to calculate something more complex.</p>
            <code-snippet type="js">
                class SearchField {
                    render() {
                        return \`
                        <label class="search-field" aria-label="search field">
                          <input type="search" name="search" placeholder="Search...">
                        </label>
                        \`;
                    }
                    
                    static get customAttributes() {
                        return {
                            value: {execute: true}
                        }
                    }
                }
            </code-snippet>
            <footer>
              <p><strong>Next:</strong> <a href="${templatingLink}/debuging">Debuging</a></p>
              <p><strong>Prev:</strong> <a href="${templatingLink}/fragments-and-ignore">Fragments & Ignore</a></p>
            </footer>`
          },
          {
            label: "Debuging",
            path: `${templatingLink}/debuging`,
            content: `
            <p><strong>HTML+</strong> errors will point exactly at where it happens so you know where the change needs
            to happpen.</p>
            <p>On top of nice and specific error messages, there is a <a href="">log</a> tag which will log
            any value so you know under what context and what data is available at your template.</p>
            <footer>
              <p><strong>Next:</strong> <a href="${stylingLink}">Styling</a></p>
              <p><strong>Prev:</strong> <a href="${templatingLink}/custom-tags-and-attributes">Custom tags and attributes</a></p>
            </footer>`
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