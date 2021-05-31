# HTML+

HTML Template Language


## Install
Install the engine inside your project directory.
```
npm install @beforesemicolon/html-plus
```

## Basic Express Server Setup
You can get started quickly with express with this few lines of code:

```javascript
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

## Contributing to this Project
Anyone can help this project grow by using and reporting issues to be addressed.

You can also fork the project and jump into code addressing reported issues, improving code and tests altogether. By doing so, you must follow the following rules:
* Fixing an issue in code must be followed by test updates or new tests that test your solution;
* Improving code quality is always welcomed and when necessary, comment accordingly;
* Any breaking change or new feature must be first reported as an issue with "new feature" or "proposal" tags and can be added to the milestone and project plan to be addressed;
* Replacing current packages used or creating custom code to address things is super encouraged and preferred where it makes sense.
