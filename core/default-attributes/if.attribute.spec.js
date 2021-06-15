const {transform} = require('./../transform');

describe('If Attribute', () => {
  it('should only process if attribute is preceded by #', () => {
    expect(transform('<b if="false"></b>')).toEqual('<b></b>')
    expect(transform('<b #if="false"></b>')).toEqual('')
  });
  
  it('should render node if condition is TRUTHY', () => {
    expect(transform('<b #if="true"></b>')).toEqual('<b></b>');
    expect(transform('<b #if="5"></b>')).toEqual('<b></b>');
    expect(transform('<b #if="4 > 0"></b>')).toEqual('<b></b>');
    expect(transform('<b #if="$data.checked"></b>', {
      data: {checked: true}
    })).toEqual('<b></b>');
    expect(transform('<b #if="!$data.checked"></b>', {
      data: {checked: false}
    })).toEqual('<b></b>');
    expect(transform('<b #if="$data.checked === false"></b>', {
      data: {checked: false}
    })).toEqual('<b></b>');
  });
  
  it('should NOT render node if condition is FALSY', () => {
    expect(transform('<b #if="false"></b>')).toEqual('');
    expect(transform('<b #if="0"></b>')).toEqual('');
    expect(transform('<b #if="null"></b>')).toEqual('');
    expect(transform('<b #if="undefined"></b>')).toEqual('');
    expect(transform('<b #if=""></b>')).toEqual('');
    expect(transform('<b #if="4 < 0"></b>')).toEqual('');
    expect(transform('<b #if="$data.checked"></b>', {
      data: {checked: false}
    })).toEqual('');
    expect(transform('<b #if="!$data.checked"></b>', {
      data: {checked: true}
    })).toEqual('');
    expect(transform('<b #if="$data.checked === false"></b>', {
      data: {checked: true}
    })).toEqual('');
  });
});