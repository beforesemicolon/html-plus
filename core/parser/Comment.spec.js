const {Comment} = require('./Comment');

describe('Comment', () => {
  it('should create no data comment', () => {
    const txt = new Comment('some {value}');
    
    expect(txt.type).toEqual('comment')
    expect(txt.value).toEqual('some {value}')
    expect(txt.toString()).toEqual('<!-- some {value} -->')
  });
});