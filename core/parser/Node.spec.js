const {Node} = require('./Node');

describe('Node', () => {
  const node = new Node();
  
  it('should get/set parent', () => {
    expect(node.parentNode).toBe(null);
  
    node.parentNode = new Node();
  
    expect(node.parentNode).toBeInstanceOf(Node);
  });
  
  it('should get/set context', () => {
    expect(node.context).toEqual({});
  
    node.context = {sample: 10};
  
    expect(node.context).toEqual({sample: 10});
    
    const newNode = new Node();
  
    newNode.context = {x: 25};
    newNode.parentNode = node;
  
    expect(newNode.context).toEqual({sample: 10, x: 25});
  });
});
