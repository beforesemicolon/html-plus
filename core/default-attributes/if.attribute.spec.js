const {transform} = require('./../transform');

describe('If Attribute', () => {
  it('should only process if attribute is preceded by #', async () => {
    await expect(transform('<b if="false"></b>')).resolves.toEqual('<b></b>')
    await expect(transform('<b #if="false"></b>')).resolves.toEqual('')
  });
  
  it('should render node if condition is TRUTHY', async () => {
    await expect(transform('<b #if="true"></b>')).resolves.toEqual('<b></b>');
    await expect(transform('<b #if="5"></b>')).resolves.toEqual('<b></b>');
    await expect(transform('<b #if="4 > 0"></b>')).resolves.toEqual('<b></b>');
    await expect(transform('<b #if="$data.checked"></b>', {
      data: {checked: true}
    })).resolves.toEqual('<b></b>');
    await expect(transform('<b #if="!$data.checked"></b>', {
      data: {checked: false}
    })).resolves.toEqual('<b></b>');
    await expect(transform('<b #if="$data.checked === false"></b>', {
      data: {checked: false}
    })).resolves.toEqual('<b></b>');
  });
  
  it('should NOT render node if condition is FALSY', async () => {
    await expect(transform('<b #if="false"></b>')).resolves.toEqual('');
    await expect(transform('<b #if="0"></b>')).resolves.toEqual('');
    await expect(transform('<b #if="null"></b>')).resolves.toEqual('');
    await expect(transform('<b #if="undefined"></b>')).resolves.toEqual('');
    await expect(transform('<b #if=""></b>')).resolves.toEqual('');
    await expect(transform('<b #if="4 < 0"></b>')).resolves.toEqual('');
    await expect(transform('<b #if="$data.checked"></b>', {
      data: {checked: false}
    })).resolves.toEqual('');
    await expect(transform('<b #if="!$data.checked"></b>', {
      data: {checked: true}
    })).resolves.toEqual('');
    await expect(transform('<b #if="$data.checked === false"></b>', {
      data: {checked: true}
    })).resolves.toEqual('');
  });
  
  describe('should work with other attributes', () => {
    it('repeat', async () => {
      await expect(transform('<b #if="false" #repeat="3">{$item}</b>')).resolves.toEqual('');
      await expect(transform('<b #if="true" #repeat="3">{$item}</b>')).resolves.toEqual('<b>1</b><b>2</b><b>3</b>');
    });
    
    it('attr', async () => {
      await expect(transform('<b #if="false" #attr="id, imp, true">item</b>')).resolves.toEqual('');
      await expect(transform('<b #if="true" #attr="id, imp, true">item</b>')).resolves.toEqual('<b id="imp">item</b>');
    });
    
    it('fragment', async () => {
      await expect(transform('<b #if="false" #fragment>item</b>')).resolves.toEqual('');
      await expect(transform('<b #if="true" #fragment>item</b>')).resolves.toEqual('item');
    });
    
    it('ignore', async () => {
      await expect(transform('<b #if="false" #ignore>{item}</b>')).resolves.toEqual('');
      await expect(transform('<b #if="true" #ignore>{item}</b>')).resolves.toEqual('<b>{item}</b>');
    });
  });
});
