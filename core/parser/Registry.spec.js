const {Registry} = require('./Registry');

describe('Registry', () => {
  const reg = new Registry();
  
  it('should define new item', () => {
    reg.define('test', {value: 10});
    
    expect(reg.isRegistered('test')).toBeTruthy()
    expect(reg.get('test')).toEqual({value: 10})
  });
})
