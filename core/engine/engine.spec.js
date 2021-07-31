const {engine} = require('./');
const request = require('supertest');
const path = require('path');
const express = require('express');
const {rmdir, mkdir, writeFile} = require('fs/promises');
const {cacheService} = require('../CacheService');

describe('engine', () => {
  let app;
  const src = path.resolve(__dirname, '__src-engine');
  const homePage = path.resolve(src, 'index.html');
  const homeStyle = path.resolve(src, 'home.scss');
  const logoFile = path.resolve(src, 'logo.png');
  const projectPage = path.resolve(src, 'project/index.html');
  const projectStyle = path.resolve(src, 'project/project.css');
  const projectScript = path.resolve(src, 'project/project.ts');
  let router;
  
  class Heading {
    constructor(node) {
      this.attributes = node.attributes;
    }
    
    static get style() {
      return `<style>h2 {font-size: 12px}</style>`
    }
    
    render() {
      return `<h2>${this.attributes.text}</h2>`
    }
  }
  
  beforeAll(async () => {
    app = express();
    await rmdir(src, {recursive: true});
    await mkdir(src);
    await mkdir(path.join(src, 'project'));
    await writeFile(homePage, '<html><head><title>{title}</title><link rel="stylesheet" href="./home.scss"></head><body><heading text="{title}"></heading></body></html>');
    await writeFile(homeStyle, 'body{background: #222} h2{color: #fff}');
    await writeFile(projectPage, '<html><head><title>{title}</title></head><body><h2>{title}</h2></body></html>');
    await writeFile(projectStyle, 'body{background: #fff} h2{color: #222}');
    await writeFile(projectScript, 'let x: number; x = 14;');
    await writeFile(logoFile, '');
  
    router = await engine(app, src, {env: 'development', customTags: [Heading]});
  })
  
  afterAll(async () => {
    await rmdir(src, {recursive: true});
  })
  
  it('should redirect to 404 page', () => {
    return request(app)
      .get('/sample')
      .then((res) => {
        expect(res.status).toBe(302);
        expect(res.text).toBe('Found. Redirecting to /404');
        expect(res.headers.location).toBe('/404');
      })
  });
  
  describe('should throw error', () => {
    let spy;
    
    beforeEach(() => {
      const oldJoin = path.join;
      spy = jest.spyOn(path, 'join').mockImplementation((...args) => {
        if (args[1] === 'hp.config.js') {
            return __dirname;
        }
        
        return oldJoin(...args);
      })
    })
    
    afterEach(() => {
      spy.mockRestore();
    })
    
    it('if static data is not an object',  () => {
      expect(() => engine(app, src, {staticData: ''}))
        .toThrowError('HTML+ static data option must be a javascript object')
    });
    
    it('if custom tags is not an array', () => {
      expect(() => engine(app, src, {customTags: {}}))
        .toThrowError('HTML+ custom tags option must be an array of valid tags.')
    });

    it('if custom attributes is not an array', () => {
      expect(() => engine(app, src, {customAttributes: {}}))
        .toThrowError('HTML+ custom attributes option must be an array of valid attributes.')
    });

    it('if onPageRequest is not an function', () => {
      expect(() => engine(app, src, {onPageRequest: null}))
        .toThrowError('"onPageRequest" option must be a function')
    });
  });
  
  describe('should render', () => {
    
    it('home page', () => {
      router.onPageRequest(req => {
        return {title: 'Home'}
      })
      
      return request(app).get('/')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.text).toBe('<html><head><title>Home</title><link rel="stylesheet" href="/home.scss"/><style>\n' +
            'heading h2 {font-size: 12px}</style></head><body><heading text="Home"><h2>Home</h2></heading></body></html>')
        })
    });
    
    it('project page', () => {
      router.onPageRequest(req => {
        return {title: 'Project'}
      })
      
      return request(app).get('/project')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.text).toBe('<html><head><title>Project</title></head><body><h2>Project</h2></body></html>')
        })
    });
    
    it('requested css file', async () => {
      await request(app).get('/home.scss')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.text.replace(/\s+/g, '')).toBe('body{background: #222;} h2{color: #fff;}'.replace(/\s+/g, ''))
        })
      
      await request(app).get('/project/project.css')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.text).toBe('body{background: #fff} h2{color: #222}')
        })
    });
    
    it('requested js file', () => {
      return request(app).get('/project/project.ts')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.text).toBe('// core/engine/__src-engine/project/project.ts\n' +
            'var x;\n' +
            'x = 14;\n')
        })
    });
    
    it('requested asset', () => {
      return request(app).get('/logo.png')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.header['content-type']).toBe('image/png')
        })
    });
  });
  
  describe('prod mode', () => {
    beforeEach(async () => {
      app = express();
      router = await engine(app, src, {env: 'production', customTags: [Heading]});
    })
  
    it('should cache home page', async () => {
      const spy = jest.spyOn(cacheService, 'cacheFile');
    
      router.onPageRequest(req => {
        return {title: 'Home'}
      })
    
      await request(app).get('/')
      expect(spy).toHaveBeenCalledTimes(1);
    
      await request(app).get('/')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.text).toBe('<html><head><title>Home</title><link rel="stylesheet" href="/home.scss"/><style>\n' +
            'heading h2 {font-size: 12px}</style></head><body><heading text="Home"><h2>Home</h2></heading></body></html>');
        });

      spy.mockRestore();
    });
  
    it('should redirect to error page', async () => {
      return request(app)
        .get('/project')
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.text).toBe('<h2>500 - Internal Server Error</h2>');
        })
    });

    it('should cache page resource', async () => {
      const spy = jest.spyOn(cacheService, 'getCachedValue');

      await request(app).get('/home.scss')
      expect(spy).not.toHaveBeenCalled();

      await request(app).get('/home.scss')
        .then(res => {
          expect(res.status).toBe(200);
          expect(spy).toHaveBeenCalledTimes(1);
        })

      spy.mockRestore();
    });
  });
  
});
