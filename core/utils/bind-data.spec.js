const {bindData} = require('./bind-data');

describe('bindData', () => {
  it('should keep string intact if does not contain curly braces', () => {
    const res = bindData('sample');
    
    expect(res).toEqual('sample');
  });
  
  it('should keep string intact if not executable found', () => {
    const res = bindData('{sample');
  
    expect(res).toEqual('{sample');
  });
  
  it('should throw error if not data found', () => {
    expect(() => bindData('{sample}')).toThrowError('sample is not defined');
  });
  
  it('should return string with bind data', () => {
    expect(bindData('{sample}', {sample: 10})).toEqual('10');
    expect(bindData('{{data: sample}}', {sample: 10})).toEqual('[object Object]');
    expect(bindData('{JSON.stringify({data: sample, test: 30})}', {sample: 10})).toEqual('{"data":10,"test":30}');
  });
});