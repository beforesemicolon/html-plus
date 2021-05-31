const {TextNode} = require('./TextNode');

describe('TextNode', () => {
  it('should take a string or a node', () => {
    expect(new TextNode('sample text')).toEqual({value: "sample text"});
    expect(new TextNode({rawText: 'sample text'})).toEqual({value: "sample text"});
  });
  
  it('should convert value if it is numeric or boolean string', () => {
    expect(new TextNode('true')).toEqual({value: true});
    expect(new TextNode('false')).toEqual({value: false});
    expect(new TextNode('12')).toEqual({value: 12});
    expect(new TextNode('12m')).toEqual({value: "12m"});
  });
  
  it('should bind data to value', () => {
    expect(new TextNode('{sample}', {sample: 'some text'})).toEqual({value: 'some text'});
    expect(new TextNode('here it is "{sample}"', {sample: 'some text'})).toEqual({value: 'here it is "some text"'});
  });
  
  it('should update node raw text', () => {
    const node = {rawText: 'here it is "{sample}"'};
  
    new TextNode(node, {sample: 'some text'});
    
    expect(node.rawText).toEqual('here it is "some text"');
  });
});