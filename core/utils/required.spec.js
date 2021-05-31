const {required} = require('./required');

describe('required', () => {
  it('should throw error with default name', () => {
    expect(() => required()).toThrowError('"param" is required argument');
  });
  
  it('should throw error with provided name', () => {
    expect(() => required('arg')).toThrowError('"arg" is required argument');
  });
  
  it('should throw error if argument is missing or is undefined', () => {
    const fn = (x = required('arg')) => null;
  
    expect(() => fn()).toThrowError('"arg" is required argument');
    expect(() => fn(undefined)).toThrowError('"arg" is required argument');
  });
  
  it('should NOT throw error if argument is provided', () => {
    const fn = (x = required('arg')) => x;
  
    expect(() => fn(12)).not.toThrow();
    expect(() => fn('good')).not.toThrow();
    expect(() => fn('')).not.toThrow();
    expect(() => fn(null)).not.toThrow();
    expect(() => fn(0)).not.toThrow();
  });
});