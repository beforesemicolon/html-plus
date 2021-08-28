const {transform} = require('../../transform');

describe('Log Tag', () => {
  let logSpy = null;
  
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => null);
  })
  
  afterAll(() => {
    logSpy.mockRestore();
  })
  
  it('should log null if no value specified', async () => {
    const str = '<variable name="sample" value="{x: 10}"></variable><log></log>'
    
    await expect(transform(str)).resolves.toEqual('<pre style="overflow: scroll">null</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
  
  it('should log specified value', async () => {
    const str = '<variable name="sample" value="{x: 10}"></variable><log value="sample"></log>'
  
    await expect(transform(str)).resolves.toEqual('<pre style="overflow: scroll">{\n' +
      '  "value": {\n' +
      '    "x": 10\n' +
      '  }\n' +
      '}</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
  
  it('should add label to log', async () => {
    const str = '<variable name="sample" value="{x: 10}"></variable><log value="sample">my sample</log>'
  
    await expect(transform(str)).resolves.toEqual('<p>my sample</p><pre style="overflow: scroll">{\n' +
      '  "value": {\n' +
      '    "x": 10\n' +
      '  }\n' +
      '}</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
});
