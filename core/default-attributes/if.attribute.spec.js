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
    await expect(transform('<b #if="checked"></b>', {
      data: {checked: true}
    })).resolves.toEqual('<b></b>');
    await expect(transform('<b #if="!checked"></b>', {
      data: {checked: false}
    })).resolves.toEqual('<b></b>');
    await expect(transform('<b #if="checked === false"></b>', {
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
    await expect(transform('<b #if="checked"></b>', {
      data: {checked: false}
    })).resolves.toEqual('');
    await expect(transform('<b #if="!checked"></b>', {
      data: {checked: true}
    })).resolves.toEqual('');
    await expect(transform('<b #if="checked === false"></b>', {
      data: {checked: true}
    })).resolves.toEqual('');
  });
});