const {transform} = require('./core/transform');
const Benchmark = require('benchmark');
const {htmlTransformer} = require('../transformers/html.transformer');

const html = `
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width initial-scale=1.0, minimum-scale=1.0">

<meta name="description" content="Blog &amp; Youtube Channel | Web, UI, Software Development">
<title>Home - Before Semicolon</title>
<link rel="stylesheet" href="/pages/home.scss" type="text/css">
<script defer="" src="/bfs.js" type="application/javascript"></script></head>
<body data-new-gr-c-s-check-loaded="14.1012.0" data-gr-ext-installed="">


<header id="page-header">
<h1>
<img src="../../assets/before-semicolon-logo.png" alt="Before Semicolon logo">
</h1>
<nav id="page-nav">
<ul>
<li class="active">
<a href="/">Home</a>
</li>
<li class="">
<a href="/articles">Articles</a>
</li>
<li class="">
<a href="/about">About</a>
</li>
<li class="">
<a href="/contact">Contact</a>
</li>
</ul>
</nav>
</header>
<main>
<div class="banner-post">
<div class="post-detail">
<h2>Post 1</h2>
<p>As humans, we solve problems all the time and as developers, it is no different. Problem-solving-focused courses are not very popular or common and a lot of developers tend to focus on learning tools, languages, and frameworks rather than learning how to think like a problem solver, a programmer.
What is Problem Solving?</p>
<a href="">read more</a>
</div>
<img src="assets/thumb1.jpg" alt="Post 1">
</div>
<section id="articles">
<h2>Articles</h2>
<div class="wrapper">
<a class="post" href="">
<img src="assets/thumb2.jpg" alt="Post 2">
<h3>Post 2</h3>
<p>As humans, we solve problems all the time and as developers, it is no different. Problem-solving-focused courses are not very popular or common and a lot of developers tend to focus on learning tools, languages, and frameworks rather than learning how to think like a problem solver, a programmer.
What is Problem Solving?</p>
<p>published on 5/17/2021, 2:10:30 AM</p>
</a>
<a class="post" href="">
<img src="assets/thumb3.jpg" alt="Post 3">
<h3>Post 3</h3>
<p>As humans, we solve problems all the time and as developers, it is no different. Problem-solving-focused courses are not very popular or common and a lot of developers tend to focus on learning tools, languages, and frameworks rather than learning how to think like a problem solver, a programmer.
What is Problem Solving?</p>
<p>published on 5/17/2021, 2:10:30 AM</p>
</a>
<a class="post" href="">
<img src="assets/thumb4.jpg" alt="Post 4">
<h3>Post 4</h3>
<p>As humans, we solve problems all the time and as developers, it is no different. Problem-solving-focused courses are not very popular or common and a lot of developers tend to focus on learning tools, languages, and frameworks rather than learning how to think like a problem solver, a programmer.
What is Problem Solving?</p>
<p>published on 5/17/2021, 2:10:30 AM</p>
</a>
<a class="post" href="">
<img src="assets/thumb5.jpeg" alt="Post 5">
<h3>Post 5</h3>
<p>As humans, we solve problems all the time and as developers, it is no different. Problem-solving-focused courses are not very popular or common and a lot of developers tend to focus on learning tools, languages, and frameworks rather than learning how to think like a problem solver, a programmer.
What is Problem Solving?</p>
<p>published on 5/17/2021, 2:10:30 AM</p>
</a>
</div>
</section>
</main>
<footer id="footer">
<p>copyright © Before Semicolon 2021. all rights reserved</p>
</footer>
<script src="/pages/home.ts"></script>



</body></html>
`;

const html2 = `
<h2>Post 1</h2>
`

// htmlTransformer(html)
//   .then(res => {
//     // console.log('-- res 2', res);
//   })

console.time('html+');
transform(html)
  .then(res => {
    // console.log('-- html+', res);
    console.timeEnd('html+');
  })

// console.time('html');
// htmlTransformer(html)
//   .then(res => {
//     // console.log('-- html', res);
//     console.timeEnd('html');
//   })

// const suite = new Benchmark.Suite();
//
// suite
//   .add('html+', {
//     'defer': true,
//     fn: function (deferred) {
//       transform(html)
//         .then(res => {
//           // console.log('-- html+', res);
//           deferred.resolve();
//           return res;
//         })
//     }
//   })
//   .add('html', {
//     'defer': true,
//     fn: function (deferred) {
//       htmlTransformer(html)
//         .then(res => {
//           // console.log('-- html', res);
//           deferred.resolve();
//           return res;
//         })
//     }
//   })
//   .on('complete', function () {
//     console.log(this[0].name, this[0].times)
//     console.log(this[1].name, this[1].times)
//   }).run()

