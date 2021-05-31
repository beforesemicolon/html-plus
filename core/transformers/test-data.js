const css = `
  @custom-media --viewport-medium (width <= 50rem);
  @custom-selector :--heading h1, h2, h3, h4, h5, h6;
  
  :root {
    --mainColor: #12345678;
  }
  
  body {
    color: var(--mainColor);
    font-family: system-ui;
    overflow-wrap: break-word;
  }
  
  input {
    appearance: none;
  }
  ::placeholder {
    color: gray;
  }
  
  .image {
    background-image: url(image@1x.png);
  }
  @keyframes test {
    100% {opacity: 1}
  }
  @media (min-resolution: 2dppx) {
    .image {
      background-image: url(image@2x.png);
    }
  }
  
  :--heading {
    background-image: image-set(url(img/heading.png) 1x, url(img/heading@2x.png) 2x);
  
    @media (--viewport-medium) {
      margin-block: 0;
    }
  }
  
  a {
    color: rgb(0 0 100% / 90%);
  
    &:hover {
      color: rebeccapurple;
    }
  }
`;
const cssResult = `
  :root {
    --mainColor: rgba(18,52,86,0.47059);
  }
  
  body {
    color: rgba(18,52,86,0.47059);
    color: var(--mainColor);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
    word-wrap: break-word;
  }
  
  input {
    -webkit-appearance: none;
            appearance: none;
  }
  :-ms-input-placeholder {
    color: gray;
  }
  ::placeholder {
    color: gray;
  }
  
  .image {
    background-image: url(image@1x.png);
  }
  @keyframes test {
    100% {opacity: 1}
  }
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
    .image {
      background-image: url(image@2x.png);
    }
  }
  
  h1,h2,h3,h4,h5,h6 {
    background-image: url(img/heading.png)
  }
  
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    h1,h2,h3,h4,h5,h6 {
      background-image:  url(img/heading@2x.png)
    }
  }
  
  h1,h2,h3,h4,h5,h6 {
    background-image: -webkit-image-set(url(img/heading.png) 1x, url(img/heading@2x.png) 2x);
    background-image: image-set(url(img/heading.png) 1x, url(img/heading@2x.png) 2x)
  }
  
  @media (max-width: 50rem) {
  
  h1,h2,h3,h4,h5,h6 {
      margin-top: 0;
      margin-bottom: 0
  }
    }
  
  a {
    color: rgba(0, 0, 255, 0.9)
  }
  
  a:hover {
    color: #639;
  }
  `;
const scss = `
  $font-stack: Helvetica, sans-serif;
  $primary-color: #333;
  
  body {
    font: 100% $font-stack;
    color: $primary-color;
  }
  
  nav {
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  
    li { display: inline-block; }
  
    a {
      display: block;
      padding: 6px 12px;
      text-decoration: none;
    }
  }
  
  @mixin corner-icon($name, $top-or-bottom, $left-or-right) {
    .icon-#{$name} {
      background-image: url("/icons/#{$name}.svg");
      position: absolute;
      #{$top-or-bottom}: 0;
      #{$left-or-right}: 0;
    }
  }
  
  @include corner-icon("mail", top, left);
  
  %message-shared {
    border: 1px solid #ccc;
    padding: 10px;
    color: #333;
  }
  
  .message {
    @extend %message-shared;
  }
  
  article[role="main"] {
    float: left;
    width: 600px / 960px * 100%;
  }
  
  @function pow($base, $exponent) {
    $result: 1;
    @for $_ from 1 through $exponent {
      $result: $result * $base;
    }
    @return $result;
  }
  
  .sidebar {
    float: left;
    margin-left: pow(4, 3) * 1px;
  }
`;
const scssResult = `
 body {
    font: 100% Helvetica, sans-serif;
    color: #333; }
  
  nav ul {
    margin: 0;
    padding: 0;
    list-style: none; }
  
  nav li {
    display: inline-block; }
  
  nav a {
    display: block;
    padding: 6px 12px;
    text-decoration: none; }
  
  .icon-mail {
    background-image: url("/icons/mail.svg");
    position: absolute;
    top: 0;
    left: 0; }
  
  .message {
    border: 1px solid #ccc;
    padding: 10px;
    color: #333; }
  
  article[role="main"] {
    float: left;
    width: 62.5%; }
  
  .sidebar {
    float: left;
    margin-left: 64px; }
`;
const sass = `
$font-stack: Helvetica, sans-serif
$primary-color: #333

body
  font: 100% $font-stack
  color: $primary-color

nav
  ul
    margin: 0
    padding: 0
    list-style: none

  li
    display: inline-block

  a
    display: block
    padding: 6px 12px
    text-decoration: none

=corner-icon($name, $top-or-bottom, $left-or-right)
  .icon-#{$name}
    background-image: url("/icons/#{$name}.svg")
    position: absolute
    #{$top-or-bottom}: 0
    #{$left-or-right}: 0

@include corner-icon("mail", top, left)

%message-shared
  border: 1px solid #ccc
  padding: 10px
  color: #333

.message
  @extend %message-shared

article[role="main"]
  float: left
  width: 600px / 960px * 100%

@function pow($base, $exponent)
  $result: 1
  @for $_ from 1 through $exponent
    $result: $result * $base
    
  @return $result

.sidebar
  float: left
  margin-left: pow(4, 3) * 1px
`;
const sassResult = `
body {
  font: 100% Helvetica, sans-serif;
  color: #333; }

nav ul {
  margin: 0;
  padding: 0;
  list-style: none; }

nav li {
  display: inline-block; }

nav a {
  display: block;
  padding: 6px 12px;
  text-decoration: none; }

.icon-mail {
  background-image: url("/icons/mail.svg");
  position: absolute;
  top: 0;
  left: 0; }

.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333; }

article[role="main"] {
  float: left;
  width: 62.5%; }

.sidebar {
  float: left;
  margin-left: 64px; }
`;
const less = `
@link-color:        #428bca; // sea blue
@link-color-hover:  darken(@link-color, 10%);

a,
.link {
  color: @link-color;
}
a:hover {
  color: @link-color-hover;
}
.widget {
  color: #fff;
  background: @link-color;
}

@my-selector: banner;
.@{my-selector} {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}

.lazy-eval {
  width: @var;
}

@var: @a;
@a: 9%;
.widget {
  color: #efefef;
  background-color: $color;
}

.button {
  &-ok {
    background-image: url("ok.png");
  }
  &-cancel {
    background-image: url("cancel.png");
  }

  &-custom {
    background-image: url("custom.png");
  }
}

.link {
  & + & {
    color: red;
  }

  & & {
    color: green;
  }

  && {
    color: blue;
  }

  &, &ish {
    color: cyan;
  }
}

.header {
  .menu {
    border-radius: 5px;
    .no-borderradius & {
      background-image: url("images/button-background.png");
    }
  }
}

nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}

.mixin() {
  box-shadow+: inset 0 0 10px #555;
}
.myclass {
  .mixin();
  box-shadow+: 0 0 20px black;
}

.a, #b {
  color: red;
}
.mixin-class {
  .a();
}
.mixin-id {
  #b();
}

.border-radius(@radius) {
  -webkit-border-radius: @radius;
     -moz-border-radius: @radius;
          border-radius: @radius;
}
.button {
  .border-radius(6px);
}
@my-option: true;
button when (@my-option = true) {
  color: white;
}
`;
const lessResult = `
a,
.link {
  color: #428bca;
}
a:hover {
  color: #3071a9;
}
.widget {
  color: #fff;
  background: #428bca;
}
.banner {
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}
.lazy-eval {
  width: 9%;
}
.widget {
  color: #efefef;
  background-color: #efefef;
}
.button-ok {
  background-image: url("ok.png");
}
.button-cancel {
  background-image: url("cancel.png");
}
.button-custom {
  background-image: url("custom.png");
}
.link + .link {
  color: red;
}
.link .link {
  color: green;
}
.link.link {
  color: blue;
}
.link,
.linkish {
  color: cyan;
}
.header .menu {
  border-radius: 5px;
}
.no-borderradius .header .menu {
  background-image: url("images/button-background.png");
}
nav ul {
  background: blue;
}
.inline,
nav ul {
  color: red;
}
.myclass {
  box-shadow: inset 0 0 10px #555, 0 0 20px black;
}
.a,
#b {
  color: red;
}
.mixin-class {
  color: red;
}
.mixin-id {
  color: red;
}
.button {
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
}
button {
  color: white;
}
`;
const stylus = `
font-size = 14px
add(a, b)
  a + b

body
  font font-size Arial, sans-serif
  padding add(10px, 5)
textarea, input
  border 1px solid #eee
textarea
input
  color #A7A7A7
  &:hover
    color #000
.foo
  &__bar
    width: 10px

    ^[0]:hover &
      width: 20px
vendor(prop, args)
  -webkit-{prop} args
  -moz-{prop} args
  {prop} args

border-radius()
  vendor('border-radius', arguments)

button
  border-radius 1px 2px / 3px 4px
  
border-radius(n)
  -webkit-border-radius n
  -moz-border-radius n
  border-radius n

form input[type=button]
  border-radius(5px)
  `;
const stylusResult = `
body {
  font: 14px Arial, sans-serif;
  padding: 15px;
}
textarea,
input {
  border: 1px solid #eee;
}
textarea,
input {
  color: #a7a7a7;
}
textarea:hover,
input:hover {
  color: #000;
}
.foo__bar {
  width: 10px;
}
.foo:hover .foo__bar {
  width: 20px;
}
button {
  -webkit-border-radius: 1px 2px/3px 4px;
  -moz-border-radius: 1px 2px/3px 4px;
  border-radius: 1px 2px/3px 4px;
}
form input[type=button] {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
`;
const js = `
  class Home {
    #test = 10;
  
    constructor() {}
    
    get n() { return 10; }
  }
  `;
const jsResult = `
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var _test;
  class Home {
    constructor() {
      __privateAdd(this, _test, 10);
    }
    get n() {
      return 10;
    }
  }
  _test = new WeakMap();
  `;
const jsFileResult = `
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};

// transformers/__src-js/app.js
var _test;
var Home = class {
  constructor() {
    __privateAdd(this, _test, 10);
  }
  get n() {
    return 10;
  }
};
_test = new WeakMap();
`;
const ts = `
class Home {
  private test = 10;

  constructor() {}
  
  get n(): number { return 10; }
}

const home = new Home();
`;
const tsResult = `
class Home {
  constructor() {
    this.test = 10;
  }
  get n() {
    return 10;
  }
}
const home = new Home();
  `;
const tsFileResult = `
// transformers/__src-js/app.ts
var Home = class {
  constructor() {
    this.test = 10;
  }
  get n() {
    return 10;
  }
};
var home = new Home();
`;
const react = `
const react = require("react");

module.exports = class Test extends react.Component {
  state = {
    name: 'App'
  }
  
  render() {
    return (<h1>{this.state.name}</h1>)
  }
}
`;
const reactResult = `
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// transformers/__src-js/app.jsx
var react = require(react);
module.exports = class Test extends react.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", {
      name: "App"
    });
  }
  render() {
    return /* @__PURE__ */ React.createElement("h1", null, this.state.name);
  }
};`;

module.exports = {
  css,
  cssResult,
  scss,
  scssResult,
  sass,
  sassResult,
  less,
  lessResult,
  stylus,
  stylusResult,
  js,
  jsFileResult,
  jsResult,
  ts,
  tsFileResult,
  tsResult,
  react,
  reactResult
}