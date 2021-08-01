const {Attribute} = require("./Attribute");
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
    <link rel="stylesheet" href="/website/src/home.scss" type="text/css">
    <script defer="" src="/bfs.js" type="application/javascript"></script></head>
  <body>
  
  </body>
  </html>
  `;
  
  it('should transform html file', async () => {
    return transform(html)
      .then(res => {
        expect(res.replace(/\s+/g, '')).toEqual(`
        <html lang="en">
        <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width initial-scale=1.0, minimum-scale=1.0"/>
        <meta name="description" content="Blog & Youtube Channel | Web, UI, Software Development"/>
        <title>Home - Before Semicolon</title>
        <link rel="stylesheet" href="/website/src/home.scss" type="text/css"/>
        <script defer src="/bfs.js" type="application/javascript"></script></head>
        <body>
        </body>
        </html>
        `.replace(/\s+/g, ''));
      })
  });
  
  describe('should take options as first arg', () => {
    it('should throw error if no file specified', async () => {
      await expect(transform({}))
        .rejects.toThrowError('If no string content is provided, the "file" option must be provided.')
    });
  
    it('should throw error if no file specified', async () => {
      const opt = {
        file: {
          load() {},
          content: ''
        }
      }
      const spy = jest.spyOn(opt.file, 'load').mockReturnValue('');
      const res = await transform(opt);
      
      expect(spy).toHaveBeenCalled();
      expect(res).toEqual('');
  
      spy.mockRestore();
    });
  
    it('should transform with custom tags and attributes', async () => {
      class Tag {
        render() {
          return '<p>tag</p>'
        }
      }
      class Cls extends Attribute {
        render(val, node) {
          node.setAttribute('class', val)
          return node;
        }
      }
      
      await expect(transform({
        file: {
          load() {},
          content: '<tag></tag><p #cls="paragraph">attr</p>'
        },
        customTags: [Tag],
        customAttributes: [Cls],
      }))
        .resolves.toEqual('<tag><p>tag</p></tag><p class="paragraph">attr</p>')
    });
  });
});
