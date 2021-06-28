const {composeTagString} = require('./compose-tag-string');

describe('composeTagString', () => {
  it('should compose an empty and not attribute un-named tag', () => {
    expect(() => composeTagString()).toThrowError('composeTagString first argument must be HTMLNode or HTMLNode-like object');
  });
  
  it('should compose an empty and no attribute custom tag', () => {
    expect(composeTagString({tagName: 'my-tag'})).toEqual('<my-tag></my-tag>');
    expect(composeTagString({tagName: 'btn'})).toEqual('<btn></btn>');
  });
  
  it('should compose an empty and no attribute self closing tag', () => {
    expect(composeTagString({tagName: 'link'})).toEqual('<link/>');
    expect(composeTagString({tagName: 'hr'})).toEqual('<hr/>');
    expect(composeTagString({tagName: 'meta'})).toEqual('<meta/>');
  });
  
  it('should compose an empty and no attribute closed tag', () => {
    expect(composeTagString({tagName: 'button'})).toEqual('<button></button>');
    expect(composeTagString({tagName: 'a'})).toEqual('<a></a>');
    expect(composeTagString({tagName: 'h2'})).toEqual('<h2></h2>');
  });
  
  it('should throw error if tag name is invalid', () => {
    expect(() => composeTagString({tagName: '3f'}))
      .toThrowError('Tag name "3f" is invalid! Tags must start with a letter and can be optionally followed by letters, numbers and dashes.');
  });
  
  it('should compose a tag with provided attributes', () => {
    expect(composeTagString({
      tagName: 'a', attributes: {
        download: '',
        href: '/some-link'
      }
    })).toEqual('<a download href="/some-link"></a>');
  });
  
  it('should compose a tag with provided children content', () => {
    expect(composeTagString({tagName: 'a'}, 'my link')).toEqual('<a>my link</a>');
  });
  
  it('should compose a tag with provided attributes and children content', () => {
    expect(composeTagString({
      tagName: 'a', attributes: {
        download: '',
        href: '/some-link'
      }
    }, 'my link')).toEqual('<a download href="/some-link">my link</a>');
  });
});