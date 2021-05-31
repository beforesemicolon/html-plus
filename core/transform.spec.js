const {transform} = require('./transform');

describe('transform', () => {
  const html = `
  <variable name="title">Home - Before Semicolon</variable>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width initial-scale=1.0, minimum-scale=1.0">
    <meta name="description" content="Blog &amp; Youtube Channel | Web, UI, Software Development">
    <title>{title}</title>
    <link rel="stylesheet" href="/test/pages/home.scss" type="text/css">
    <script defer="" src="/bfs.js" type="application/javascript"></script></head>
  <body>
  
  </body>
  </html>
  `;
  
  it('should transform html file', async () => {
    const result = await transform(html);
    return expect(result.replace(/\s+/g, '')).toEqual(`
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width initial-scale=1.0, minimum-scale=1.0"/>
      <meta name="description" content="Blog & Youtube Channel | Web, UI, Software Development"/>
      <title>Home - Before Semicolon</title>
      <link rel="stylesheet" href="/test/pages/home.scss" type="text/css"/>
      <script defer src="/bfs.js" type="application/javascript"></script></head>
    <body>
    
    </body>
    </html>
    `.replace(/\s+/g, ''));
  });
});