const {Text} = require('./Text');

describe('Text', () => {
  const txt = new Text('some');
  
  it('should create no data text', () => {
    expect(txt.nodeName).toEqual('#text')
    expect(txt.nodeType).toEqual(3)
    expect(txt.nodeValue).toEqual('some')
    expect(txt.textContent).toEqual('some')
    expect(txt.toString()).toEqual('some')
  });
  
  it('should clone', () => {
    const clone = txt.cloneNode();
  
    expect(clone === txt).toBeFalsy()
    expect(clone.textContent).toEqual('some')
  });
  
  it('should update text', () => {
    txt.textContent = 'some text';
  
    expect(txt.textContent).toEqual('some text')
  });
});
