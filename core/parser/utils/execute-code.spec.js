const {executeCode} = require('./execute-code');

describe('execute', () => {
  it('should execute code', async () => {
    expect(executeCode('Array.from({length: 3}, (_, i) => ((i+1) * 2))')).toEqual([2, 4, 6]);
    expect(executeCode('1 + 1')).toBe(2);
    expect(executeCode('Math.pow(3, 9)')).toBe(19683);
    expect(executeCode('1 * "2"')).toBe(2);
    expect(executeCode('5 * x', {x: 20})).toBe(100);
    expect(executeCode('str.replace(2, "")', {str: 'name2'})).toBe('name');
    expect(executeCode('this.z - 2000', {z: 3000})).toBe(1000);
  });
  
  it('should throw error when variable does not exist', async () => {
    expect.assertions(1);
    
    await expect(() => executeCode('x + y', {x: 10}))
      .toThrowError('y is not defined');
  });
  
  it('should not have access to global vars', () => {
    expect(() => executeCode('__dirname')).toThrowError('__dirname is not defined');
    expect(() => executeCode('__filename')).toThrowError('__filename is not defined');
    expect(() => executeCode('global')).toThrowError('global is not defined');
    expect(() => executeCode('new URL()')).toThrowError('URL is not a constructor');
    expect(() => executeCode('new URLSearchParams()')).toThrowError('URLSearchParams is not a constructor');
    expect(() => executeCode('require')).toThrowError('require is not defined');
    expect(() => executeCode('module')).toThrowError('module is not defined');
    expect(() => executeCode('import')).toThrowError('Cannot use import statement outside a module');
  });
});
