const {Tag} = require('./Tag');

describe('Tag', () => {
  it('should create tag with default options', async () => {
    const tag = new Tag();
    
    expect(tag.tagName).toEqual('tag')
    expect(tag.attributes).toEqual({})
    expect(tag.children).toEqual([])
    expect(tag.context).toEqual({})
    expect(tag.render()).toEqual('')
    expect(tag.composeTagString()).toEqual('<tag></tag>')
    await expect(tag.renderChildren()).resolves.toEqual('')
  });
  
  it('should create tag with basic provided info', async () => {
    const tag = new Tag({
      attributes: {
        test: 'good'
      },
      children: ['tested']
    });
    
    const content = await tag.renderChildren();
    
    expect(tag.tagName).toEqual('tag')
    expect(tag.attributes).toEqual({test: 'good'})
    expect(tag.children).toEqual(['tested'])
    expect(tag.context).toEqual({})
    expect(tag.render()).toEqual('')
    expect(tag.composeTagString(content)).toEqual('<tag test="good">tested</tag>');
    expect(content).toEqual('tested')
  });
});