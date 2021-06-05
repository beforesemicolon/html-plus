# HTML+

HTML Template Language

![html+](https://img.shields.io/badge/beforesemicolon-html%2B-blue)
![Build](https://github.com/beforesemicolon/html-plus//actions/workflows/main.yml/badge.svg)
![license](https://img.shields.io/github/license/beforesemicolon/html-plus)


## Install
Install the engine inside your project directory.
```
npm install @beforesemicolon/html-plus
```

## Basic Express Server Setup
You can get started quickly with express with this few lines of code:

```javascript
// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const {engine} = require('@beforesemicolon/html-plus');

const app = express();

// initialize the engine by passing the express app
// and the absolute path to the HTML pages directory
engine(app, path.resolve(__dirname, './pages'));

app.get('/', function (req, res) {
  res.render('index'); // render the page file name
})

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('listening on port 3000');
})
```

With the above setup you can organize your html files in a structure that you would like
your page routes to be. 

The way you organize your page structure will be used to create your website route.
```
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
```

## Template Tags & Attributes
HTML+ comes with couple of built-in tags that are meant to aid you with your pages. These are:

* **[include]()**: lets you include reusable partial html parts
* **[inject]()**: lets you inject html into partial files. Works like html slot
* **[variable]()**: lets you create scope data inside your template
* **[fragment]()**: lets you exclude the wrapping tag from rendering as a place to add logic

There are also some built-in attributes that let you control your tags even further. These are:

* **[if]()**: lets you conditionally render a tag
* **[repeat]()**: allows you to specify how the tag repeats bases on data you provide
* **[fragment]()**: has the same purpose as the tag version of it
* **[inject]()**: lets you flags the html you need to inject. works like the slot attribute
* **[compiler]()**: lets you specify the compiler for style and script tags like typescript and SASS.

These list have the potential to grow but you can also [create your own tags and attributes]()
that fits your project. You can come up with your own rules and behavior for the template and this
is what makes HTML+ more appealing. It allows you to extend the template easily

## Template Data Binding

HTML+ also lets you bind data from files directly into your templates. 
All data is scoped and immutable. This is done using curly braces. Take the following file structure as example:

```
- pages
    index.html
  data
    posts.json
```

You can reference the `post.json` file inside your template like so.

```html
<div #repeat="posts as post">
    <h2>{post.title}</h2>
    <p>{post.description}</p>
</div>
```

For special attributes you don't need the curly braces to bind data, but everywhere else you need to wrap
your data reference inside curly braces. [Check full DOC to learn more]().


## Contributing to this Project
Anyone can help this project grow by using and reporting issues to be addressed.

You can also fork the project and jump into code addressing reported issues, improving code and tests altogether. By doing so, you must follow the following rules:
* Fixing an issue in code must be followed by test updates or new tests that test your solution;
* Improving code quality is always welcomed and when necessary, comment accordingly;
* Any breaking change or new feature must be first reported as an issue with "new feature" or "proposal" tags and can be added to the milestone and project plan to be addressed;
* Replacing current packages used or creating custom code to address things is super encouraged and preferred where it makes sense.
