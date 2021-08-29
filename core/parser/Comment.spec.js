const {Comment} = require('./Comment');

describe('Comment', () => {
  const comm = new Comment('comment');
  
  it('should create no data text', () => {
    expect(comm.nodeName).toEqual('#comment')
    expect(comm.nodeType).toEqual(8)
    expect(comm.nodeValue).toEqual('comment')
    expect(comm.textContent).toEqual('comment')
    expect(comm.toString()).toEqual('<!-- comment -->')
  });
  
  it('should clone', () => {
    const clone = comm.cloneNode();
    
    expect(clone === comm).toBeFalsy()
    expect(clone.textContent).toEqual('comment')
  });
  
  it('should update text', () => {
    comm.textContent = 'some text';
    
    expect(comm.textContent).toEqual('some text')
  });
});
