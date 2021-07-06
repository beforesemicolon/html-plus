const {turnCamelOrPascalToKebabCasing} = require('./turn-camel-or-pascal-to-kebab-casing');

describe('turnCamelOrPascalToKebabCasing', () => {
  it('should turn camel case to kebab', () => {
    expect(turnCamelOrPascalToKebabCasing('some')).toEqual('some')
    expect(turnCamelOrPascalToKebabCasing('someName')).toEqual('some-name')
    expect(turnCamelOrPascalToKebabCasing('someNameTest')).toEqual('some-name-test')
  });
  
  it('should turn pascal case to kebab', () => {
    expect(turnCamelOrPascalToKebabCasing('Some')).toEqual('some')
    expect(turnCamelOrPascalToKebabCasing('SomeName')).toEqual('some-name')
    expect(turnCamelOrPascalToKebabCasing('SomeNameTest')).toEqual('some-name-test')
    expect(turnCamelOrPascalToKebabCasing('SomeNameTestDST')).toEqual('some-name-test-d-s-t')
    expect(turnCamelOrPascalToKebabCasing('DSTTag')).toEqual('d-s-t-tag')
  });
});