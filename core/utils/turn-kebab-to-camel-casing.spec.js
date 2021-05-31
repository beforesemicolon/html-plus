const {turnKebabToCamelCasing} = require('./turn-kebab-to-camel-casing');

describe('turnKebabToCamelCasing', () => {
  it('should turn kebab to camel case', () => {
    expect(turnKebabToCamelCasing('some')).toEqual('some')
    expect(turnKebabToCamelCasing('some-name')).toEqual('someName')
    expect(turnKebabToCamelCasing('some-name-test')).toEqual('someNameTest')
    expect(turnKebabToCamelCasing('some-5name-test')).toEqual('some5nameTest')
    expect(turnKebabToCamelCasing('9some-5name-test')).toEqual('9some5nameTest')
    expect(turnKebabToCamelCasing('9some-5name-7test')).toEqual('9some5name7test')
  });
});