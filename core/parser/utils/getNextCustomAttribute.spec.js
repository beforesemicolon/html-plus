const {getNextCustomAttribute} = require("./getNextCustomAttribute");

describe('getNextCustomAttribute', () => {
  it('should get correct next attribute to process', () => {
    [
      [{['#if']: '', ['#repeat']: ''}, '#if'],
      [{['#repeat']: '', ['#sample']: ''}, '#repeat'],
      [{['#sample']: '', ['#ignore']: ''}, '#ignore'],
      [{['#ignore']: '', ['#attr']: ''}, '#attr'],
      [{['#attr']: '', ['#ignore']: ''}, '#attr'],
      [{['class']: '', ['#repeat']: ''}, '#repeat'],
      [{['id']: '', ['#if']: ''}, '#if'],
    ].forEach(([node, res]) => {
      expect(getNextCustomAttribute(node)).toBe(res)
    })
  });
});
