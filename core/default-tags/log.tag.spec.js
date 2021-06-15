const {transform} = require('./../transform');

describe('Log Tag', () => {
  let logSpy = null;
  
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => null);
  })
  
  afterAll(() => {
    logSpy.mockRestore();
  })
  
  it('should log context if no value specified', () => {
    const str = '<variable name="sample">{x: 10}</variable><log></log>'
    
    expect(transform(str)).toEqual('<p>log</p><pre style="overflow: scroll">null</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
  
  it('should log specified value', () => {
    const str = '<variable name="sample">{x: 10}</variable><log value="sample"></log>'
  
    expect(transform(str)).toEqual('<p>log</p><pre style="overflow: scroll">{x: 10}</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
  
  it('should add label to log', () => {
    const str = '<variable name="sample">{x: 10}</variable><log value="sample">my sample</log>'
  
    expect(transform(str)).toEqual('<p>my sample</p><pre style="overflow: scroll">{x: 10}</pre>');
    expect(logSpy).toHaveBeenCalled()
  });
});