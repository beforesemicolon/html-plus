const {defineGetter} = require('./define-getter');

describe('defineGetter', () => {
  const obj = Object.create(null);
  
  it('should define getter that calls a function to get the value', () => {
    defineGetter(obj, 'test', () => 23);
  
    expect(obj.test).toEqual(23);
  });
  
  it('should define getter with static value', () => {
    defineGetter(obj, 'sample', 45);
    
    expect(obj.sample).toEqual(45);
  });
});