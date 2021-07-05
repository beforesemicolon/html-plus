# HTML+

HTML Template Language

![html+](https://img.shields.io/badge/beforesemicolon-html%2B-blue)
![Build](https://github.com/beforesemicolon/html-plus//actions/workflows/main.yml/badge.svg)
![license](https://img.shields.io/github/license/beforesemicolon/html-plus)

## Simply HTML and much more
```html
<variable name="page" value="$data.pages.home"></variable>

<include partial="layout" data="page">
	<link rel="stylesheet" href="./home.scss" inject-id="style">
	<link rel="stylesheet" href="./../../node_modules/highlight.js/styles/github-dark-dimmed.css" inject-id="style">
    
    <include partial="header"></include>
    
	<section role="banner" class="wrapper">
		<h2>{$data.site.description}</h2>
		<p>{page.banner.description}</p>
		<div class="doc-links">
			<a #repeat="page.banner.links"
			   #attr="class, cta, $item.path === '/learn'"
			   href="{$item.path}" class="link-button">{$item.label}</a>
		</div>
		<p>License: <strong>{$data.site.license}</strong></p>
	</section>
    
	<link rel="stylesheet" href="./home.ts" inject-id="script">

</include>
```

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
# File Structure             # Routes

- server.js
- pages
   - index.html                /
   - contact.html              /contact
   - about.html                /about
   - 404.html                  /404
   - projects
      - index.html             /projects
      - todo-project.html      /projects/todo-project
```

## Template Tags & Attributes
HTML+ comes with couple of built-in tags that are meant to aid you with your pages. These are:

* **[include](https://html-plus.beforesemicolon.com/documentation/api-reference/include-tag)**: lets you include reusable partial html parts
* **[inject](https://html-plus.beforesemicolon.com/documentation/api-reference/inject-tag)**: lets you inject html into partial files. Works like html slot
* **[variable](https://html-plus.beforesemicolon.com/documentation/api-reference/variable-tag)**: lets you create scope data inside your template
* **[fragment](https://html-plus.beforesemicolon.com/documentation/api-reference/fragment-tag)**: lets you exclude the wrapping tag from rendering as a place to add logic

There are also some built-in attributes that let you control your tags even further. These are:

* **[if](https://html-plus.beforesemicolon.com/documentation/api-reference/if-attribute)**: lets you conditionally render a tag
* **[repeat](https://html-plus.beforesemicolon.com/documentation/api-reference/repeat-attribute)**: allows you to specify how the tag repeats bases on data you provide
* **[fragment](https://html-plus.beforesemicolon.com/documentation/api-reference/fragment-attribute)**: has the same purpose as the tag version of it

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
