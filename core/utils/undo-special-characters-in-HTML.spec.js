const {undoSpecialCharactersInHTML} = require('./undo-special-characters-in-HTML');

describe('undoSpecialCharactersInHTML', () => {
  it('should replace "gte" with ">="', () => {
    const testCases = [
      [' gte ', ' >= '],
      ['gte ', '>= '],
      [' gte', ' >='],
      ['gte', '>='],
      ['4 gte 5', '4 >= 5'],
      ['4gte 5', '4gte 5'],
      ['4 gte5', '4 gte5'],
      ['4gte5', '4gte5'],
    ];
  
    testCases.forEach(([value, expectedValue]) => {
      expect(undoSpecialCharactersInHTML(value)).toEqual(expectedValue);
    })
  });
  
  it('should replace "lte" with "<="', () => {
    const testCases = [
      [' lte ', ' <= '],
      ['lte ', '<= '],
      [' lte', ' <='],
      ['lte', '<='],
      ['4 lte 5', '4 <= 5'],
      ['4lte 5', '4lte 5'],
      ['4 lte5', '4 lte5'],
      ['4lte5', '4lte5'],
    ];
  
    testCases.forEach(([value, expectedValue]) => {
      expect(undoSpecialCharactersInHTML(value)).toEqual(expectedValue);
    })
  });
  
  it('should replace "lt" with "<"', () => {
    const testCases = [
      [' lt ', ' < '],
      ['lt ', '< '],
      [' lt', ' <'],
      ['lt', '<'],
      ['4 lt 5', '4 < 5'],
      ['4lt 5', '4lt 5'],
      ['4 lt5', '4 lt5'],
      ['4lt5', '4lt5'],
    ];
  
    testCases.forEach(([value, expectedValue]) => {
      expect(undoSpecialCharactersInHTML(value)).toEqual(expectedValue);
    })
  });
  
  it('should replace "gt" with ">"', () => {
    const testCases = [
      [' gt ', ' > '],
      ['gt ', '> '],
      [' gt', ' >'],
      ['gt', '>'],
      ['4 gt 5', '4 > 5'],
      ['4gt 5', '4gt 5'],
      ['4 gt5', '4 gt5'],
      ['4gt5', '4gt5'],
    ];
  
    testCases.forEach(([value, expectedValue]) => {
      expect(undoSpecialCharactersInHTML(value)).toEqual(expectedValue);
    })
  });
});