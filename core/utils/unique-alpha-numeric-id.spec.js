const {uniqueAlphaNumericId} = require('./unique-alpha-numeric-id');

describe('uniqueAlphaNumericId', () => {
  it('should create unique sized ids', () => {
    expect(uniqueAlphaNumericId()).toMatch(/[a-zA-Z0-9]{24}/)
    expect(uniqueAlphaNumericId(6)).toMatch(/[a-zA-Z0-9]{6}/)
    expect(uniqueAlphaNumericId(0)).toMatch(/[a-zA-Z0-9]{0}/)
  });
});