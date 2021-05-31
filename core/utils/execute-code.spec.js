const {executeCode} = require('./execute-code');

describe('execute', () => {
  it('should execute code', async () => {
    expect.assertions(5)
    
    expect(executeCode('1 + 1')).toBe(2);
    expect(executeCode('Math.pow(3, 9)')).toBe(19683);
    expect(executeCode('1 * "2"')).toBe(2);
    expect(executeCode('5 * x', {x: 20})).toBe(100);
    expect(executeCode('str.replace(2, "")', {str: 'name2'})).toBe('name');
  });

  it('should throw error', async () => {
    expect.assertions(1);
    
    await expect(() => executeCode('x + y', {x: 10}))
      .toThrowError('y is not defined');
  });
  
  it('should timeout for long executing scripts',  () => {
    expect.assertions(1);
  
    expect(() => executeCode('while(true);', {}, 3000))
      .toThrowError('Script execution timed out after 3000ms');
  });
});