const {replaceSpecialCharactersInHTML} = require("./replace-special-characters-in-HTML");

describe('replaceSpecialCharactersInHTML', () => {
  it('should replace "gte" with ">="', () => {
    const testCases = [
      [' >= ', ' gte '],
      ['>= ', 'gte '],
      [' >=', ' gte'],
      ['>=', 'gte'],
      ['4 >= 5', '4 gte 5'],
      ['4>= 5', '4>= 5'],
      ['4 >=5', '4 >=5'],
      ['4>=5', '4>=5'],
    ];
    
    testCases.forEach(([value, expectedValue]) => {
      expect(replaceSpecialCharactersInHTML(value)).toEqual(expectedValue);
    })
  });
  
  it('should replace "lte" with "<="', () => {
    const testCases = [
      [' <= ', ' lte '],
      ['<= ', 'lte '],
      [' <=', ' lte'],
      ['<=', 'lte'],
      ['4 <= 5', '4 lte 5'],
      ['4<= 5', '4<= 5'],
      ['4 <=5', '4 <=5'],
      ['4<=5', '4<=5'],
    ];
    
    testCases.forEach(([value, expectedValue]) => {
      expect(replaceSpecialCharactersInHTML(value)).toEqual(expectedValue);
    })
  });
  
  it('should replace "lt" with "<"', () => {
    const testCases = [
      [' < ', ' lt '],
      ['< ', 'lt '],
      [' <', ' lt'],
      ['<', 'lt'],
      ['4 < 5', '4 lt 5'],
      ['4< 5', '4< 5'],
      ['4 <5', '4 <5'],
      ['4<5', '4<5'],
    ];
    
    testCases.forEach(([value, expectedValue]) => {
      expect(replaceSpecialCharactersInHTML(value)).toEqual(expectedValue);
    })
  });
  
  it('should replace "gt" with ">"', () => {
    const testCases = [
      [' > ', ' gt '],
      ['> ', 'gt '],
      [' >', ' gt'],
      ['>', 'gt'],
      ['4 > 5', '4 gt 5'],
      ['4> 5', '4> 5'],
      ['4 >5', '4 >5'],
      ['4>5', '4>5'],
    ];
    
    testCases.forEach(([value, expectedValue]) => {
      expect(replaceSpecialCharactersInHTML(value)).toEqual(expectedValue);
    })
  });
});