const {getNextCustomAttribute} = require("./getNextCustomAttribute");

describe('getNextCustomAttribute', () => {
  it('should get correct next attribute to process', () => {
    [
      [['id', '#if'], '#if'],
      [['#repeat', '#if'], '#if'],
      [['#repeat', '#attr'], '#repeat'],
      [['#sample', '#attr'], '#attr'],
      [['#sample', 'class'], '#sample'],
      [['#ignore', '#fragment'], '#fragment'],
      [['#attr', '#fragment'], '#fragment'],
      [['#attr', '#sample'], '#attr'],
      [['class', '#sample'], '#sample'],
      [['id', '#sample', '#ignore'], '#ignore'],
      [['id', 'class', 'href'], null],
    ].forEach(([list, res]) => {
      expect(getNextCustomAttribute(list)).toBe(res)
    })
  });
});
