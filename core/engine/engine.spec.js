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
  const homeStyle = path.resolve(src, 'home.css');
  const logoFile = path.resolve(src, 'logo.png');
  const projectPage = path.resolve(src, 'project/index.html');
  const projectStyle = path.resolve(src, 'project/project.css');
  const projectScript = path.resolve(src, 'project/project.ts');
  let router;
  
  beforeAll(async () => {
    app = express();
    await rmdir(src, {recursive: true});
    await mkdir(src);
    await mkdir(path.join(src, 'project'));
    await writeFile(homePage, '<html><head><title>{title}</title><link rel="stylesheet" href="./home.css"></head><body><h2>{title}</h2></body></html>');
    await writeFile(homeStyle, 'body{background: #222} h2{color: #fff}');
    await writeFile(projectPage, '<html><head><title>{title}</title></head><body><h2>{title}</h2></body></html>');
    await writeFile(projectStyle, 'body{background: #fff} h2{color: #222}');
    await writeFile(projectScript, 'let x: number; x = 14;');
    await writeFile(logoFile, '');
  
    router = await engine(app, src, {env: 'development'});
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
          expect(res.text).toBe('<html><head><title>Home</title><link rel="stylesheet" href="/home.css"/></head><body><h2>Home</h2></body></html>')
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
      await request(app).get('/home.css')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.text).toBe('body{background: #222} h2{color: #fff}')
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
    beforeAll(async () => {
      app = express();
      router = await engine(app, src, {env: 'production'});
    })
  
    it('should redirect to error page', async () => {
      await engine(app, src, {env: 'production'});
    
      return request(app)
        .get('/project')
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.text).toBe('<h2>500 - Internal Server Error</h2>');
        })
    });
  
    it('should cache page', async () => {
      const spy = jest.spyOn(cacheService, 'getCachedFile');
    
      router.onPageRequest(req => {
        return {title: 'Home'}
      })
    
      await request(app).get('/')
        .then(res => {
          expect(res.status).toBe(200)
          expect(res.text).toBe('<html><head><title>Home</title><link rel="stylesheet" href="/home.css"/></head><body><h2>Home</h2></body></html>');
          expect(spy).toHaveBeenCalled()
        });
    
      spy.mockRestore();
    });
  
    it('should cache page resource', async () => {
      const spy = jest.spyOn(cacheService, 'getCachedValue');
    
      await request(app).get('/home.css')
      expect(spy).not.toHaveBeenCalled();
    
      await request(app).get('/home.css')
        .then(res => {
          expect(res.status).toBe(200);
          expect(spy).toHaveBeenCalled();
        })
    
      spy.mockRestore();
    });
  });
  
});
