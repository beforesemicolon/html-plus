const {Text} = require('./Text');

describe('Text', () => {
  it('should create no data text', () => {
    const txt = new Text('some');
    
    expect(txt.type).toEqual('text')
    expect(txt.value).toEqual('some')
    expect(txt.toString()).toEqual('some')
  });
  
  it('should create text with data ', () => {
    const txt = new Text('some {text}', {text: 'value'});
  
    expect(txt.type).toEqual('text')
    expect(txt.value).toEqual('some {text}')
    expect(txt.toString()).toEqual('some value')
  });
});