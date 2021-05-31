const {Inject} = require('./inject.tag');
const {transform} = require('./../transform');
const cp = require('child_process');
const path = require('path');
const {PartialFile} = require("../../index");
const {promisify} = require('util');

const exec = promisify(cp.exec);

describe('Inject', () => {
  const partialAbsPath = `${path.resolve(__dirname)}/_inj-partial.html`;
  let partialFile;
  
  beforeAll(async () => {
    await exec(`echo '<inject></inject>' >> ${partialAbsPath}`);
    partialFile = new PartialFile(partialAbsPath);
  })
  
  afterAll(async () => {
    await exec(`rm ${partialAbsPath}`);
  });
  
  it('should render blank if no root children', async () => {
    const str = '<inject></inject>';
    const inject = new Inject({rootChildren: null, children: () => [], attributes: {}});

    await expect(inject.render()).resolves.toEqual('');
    await expect(transform(str)).resolves.toEqual('');
  });
  
  it('should render all include children if no id provided', async () => {
    const str = '<include partial="inj-partial"><p>1</p><p>2</p><p>3</p></include>';
  
    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<p>1</p>' +
      '<p>2</p>' +
      '<p>3</p>');
  });
  
  it('should render own children if include has no children', async () => {
    partialFile.content = '<inject><p>default content</p></inject>'
    const str = '<include partial="inj-partial"></include>';

    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<p>default content</p>');
  });

  it('should render single include child with same id', async () => {
    partialFile.content = '<inject id="target"></inject>'
    const str = '<include partial="inj-partial"><p>1</p><p #inject="target">2</p><p>3</p><</include>';

    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<p>2</p>');
  });

  it('should render own children if no include children has same id', async () => {
    partialFile.content = '<inject id="target"><p>default</p></inject>'
    const str = '<include partial="inj-partial"><p>1</p><p>2</p><p>3</p><</include>';

    await expect(transform(str, {
      partialFileObjects: [partialFile]
    })).resolves.toEqual('<p>default</p>');
  });
});