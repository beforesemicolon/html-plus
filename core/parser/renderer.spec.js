jest.mock('chalk', () => ({
  green: str => str,
  yellow: str => str,
  redBright: str => str,
}));

const {writeFile, unlink} = require('fs/promises');
const path = require('path');
const {defaultAttributesMap} = require("./default-attributes");
const {customAttributesRegistry} = require("./default-attributes/CustomAttributesRegistry");
const {defaultTagsMap} = require("./default-tags");
const {customTagsRegistry} = require("./default-tags/CustomTagsRegistry");
const {PartialFile} = require("./PartialFile");
const {File} = require("./File");
const {render} = require("./render");

describe('render', () => {
  const headContent = `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
  <title>{title}</title>
  <inject id="style"></inject>
  <inject></inject>
</head>`;
  const pageContent = `<!DOCTYPE html>
<html lang="en">
<include partial="head" data="{title: 'My page'}">
 <link rel="stylesheet" href="style.css" inject-id="style">
 <style>
  body {
   background: #900;
  }
 </style>
</include>
<body>

 <inject html="'<h1>Title</h1>'"></inject>

 <variable name="x" value="100"></variable>
 <ul #attr="class, main-nav, sample > 0">
  <li #repeat="['home', 'about', 'contact']" class="{$item}-page menu-nav-item">{$item}</li>
 </ul>
 <!-- main content -->
 <main #if="x > 10"></main>
 {x + 3}
 <fragment #repeat="3">
  <h2>[{$item}] Lorem ipsum dolor sit amet.</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, ut.</p>
 </fragment>

 <!--  <log value="$context"></log>-->

 <ignore>
  <p>{noValue}</p>
 </ignore>

 <script>
      console.log('sample', {x: 10})
 </script>
</body>
</html>`;
  let pageFile, headFile;
  
  beforeAll(async () => {
    await writeFile(path.resolve(__dirname, '_head.html'), headContent, 'utf-8');
    await writeFile(path.resolve(__dirname, 'page.html'), pageContent, 'utf-8');
    
    for (let key in defaultAttributesMap) {
      customAttributesRegistry.define(key, defaultAttributesMap[key])
    }
    
    for (let key in defaultTagsMap) {
      customTagsRegistry.define(key, defaultTagsMap[key])
    }
  })
  
  beforeEach(() => {
    pageFile = new File(path.resolve(__dirname, 'page.html'), __dirname);
    headFile = new PartialFile(path.resolve(__dirname, '_head.html'), __dirname);
  })
  
  afterAll(async () => {
    await unlink(pageFile.fileAbsolutePath);
    await unlink(headFile.fileAbsolutePath);
    jest.restoreAllMocks();
  })
  
  it('should render page', () => {
    expect(render({
      file: pageFile,
      partialFiles: [headFile],
      context: {$data: {}, sample: 20, title: 'test page'}
    }).replace(/\s+/g, '')).toEqual(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
  <title>My page</title>
  <link rel="stylesheet" href="style.css">
  
 
 <style>
  body {
   background: #900;
  }
 </style>

</head>
<body>

 <h1>Title</h1>

 
 <ul class="main-nav">
  <li class="home-page menu-nav-item">home</li><li class="about-page menu-nav-item">about</li><li class="contact-page menu-nav-item">contact</li>
 </ul>
 <!-- main content -->
 <main></main>
 103
 
  <h2>[1] Lorem ipsum dolor sit amet.</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, ut.</p>
 
  <h2>[2] Lorem ipsum dolor sit amet.</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, ut.</p>
 
  <h2>[3] Lorem ipsum dolor sit amet.</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, ut.</p>
 

 <!-- <log value="$context"></log> -->

 
  <p>{noValue}</p>
 

 <script>
      console.log('sample', {x: 10})
 </script>
</body>
</html>`.replace(/\s+/g, ''))
  });
  
  it('should close tag with self-closing child node', () => {
    expect(render({
      context: {title: 'welcome'},
      content: `<head><link rel="stylesheet" href="./home.scss"></head>`
    })).toEqual('<head><link rel="stylesheet" href="./home.scss"></head>')
  });
  
  describe('should handle errors', () => {
    it('in text', () => {
      try {
        render('<div><p>{text}</p></div>')
      } catch (e) {
        expect(e.message).toEqual('Error: text is not defined\n' +
          'Markup: <p>\n' +
          '{text} <= Error: text is not defined\n' +
          '</p>')
      }
    });
    
    it('in attributes', () => {
      try {
        render('<div><p class="{cls}">Lorem ipsum dolor.</p></div>')
      } catch (e) {
        expect(e.message).toEqual('Error: cls is not defined\n' +
          'Markup: <p class="{cls}">Lorem ipsum dolor.</p>')
      }
    });
    
    it('inside custom tags', () => {
      customTagsRegistry.define('bfs-test', class {
        constructor() {
          throw new Error('tag failed')
        }
      })
  
      try {
        render('<div><bfs-test></bfs-test></div>')
      } catch (e) {
        expect(e.message).toEqual('Error: tag failed\n' +
          'Markup: <bfs-test></bfs-test>')
      }
    });
    
    it('inside custom attributes', () => {
      customAttributesRegistry.define('test', class {
        constructor() {
          throw new Error('attr failed')
        }
      })
  
      try {
        render('<div #test></div>')
      } catch (e) {
        expect(e.message).toEqual('Error: attr failed\n' +
          'Markup: <div #test></div>')
      }
    });
  
    it('inside node', () => {
      try {
        render('<div><p class="text">{no}</p></div>')
      } catch (e) {
        expect(e.message).toEqual('Error: no is not defined\n' +
          'Markup: <p class="text">\n' +
          '{no} <= Error: no is not defined\n' +
          '</p>')
      }
    });
  
    it('inside partial', () => {
      const str = '<include partial="head" data="{title: \'include partial\'}"></include>';
      headFile.content += '{nono}';
      
      try {
        render( {
          content: str,
          partialFiles: [headFile]
        })
      } catch(e) {
          expect(e.message).toEqual('Error: nono is not defined\n' +
            'File: /_head.html\n' +
            'Markup: <head>\n' +
            '  <meta charset="UTF-8">\n' +
            '  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">\n' +
            '  <title>include partial</title>\n' +
            '  <inject id="style"></inject>\n' +
            '  <inject></inject>\n' +
            '</head>\n' +
            '{nono} <= Error: nono is not defined\n' +
            '')
      }
    });
  });
});
