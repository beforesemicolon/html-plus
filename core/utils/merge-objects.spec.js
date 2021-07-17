const {mergeObjects} = require('./merge-objects');

describe('mergeObjects', () => {
  it('should return second object if one is null or not an object', () => {
    expect(mergeObjects(null, {b: 10})).toEqual({b: 10})
    expect(mergeObjects(12, {b: 10})).toEqual({b: 10})
    expect(mergeObjects('12', {b: 10})).toEqual({b: 10})
    expect(mergeObjects(() => {}, {b: 10})).toEqual({b: 10})
    
    expect(mergeObjects({a: 10}, null)).toEqual({})
  });
  
  it('should merge arrays', () => {
    expect(mergeObjects([1, 2, 4], [1, 9, 0])).toEqual([1, 9, 0])
    expect(mergeObjects([6, 2, 4], [9, 0])).toEqual([9, 0, 4])
    expect(mergeObjects([6, [2, 4]], [9, [0, 9]])).toEqual([9, [0, 9]])
    expect(mergeObjects([6, [2, [3, 1]]], [9, [0, 9]])).toEqual( [9, [0, 9]])
    expect(mergeObjects([6, [2, 6]], [9, [0, [3, 1]]])).toEqual([9, [0, [3, 1]]])
    expect(mergeObjects([6, [2, 6]], [9])).toEqual([9, [2, 6]])
    expect(mergeObjects([6, [2, 6]], [9, [1]])).toEqual([9, [1, 6]])
  });
  
  it('should merge object literals', () => {
    expect(mergeObjects({a: 12}, {b: 34})).toEqual({a: 12, b: 34})
    expect(mergeObjects({a: 12}, {a: 34})).toEqual({a: 34})
    expect(mergeObjects({a: [12, 67, 10]}, {a: [34, 90]})).toEqual({a: [34, 90, 10]})
    expect(mergeObjects({a: 10}, {a: [34, 90]})).toEqual({a: [34, 90]})
    expect(mergeObjects({a: [34, 90]}, {a: 10})).toEqual({a: 10})
    expect(mergeObjects({a: {b: 100}}, {a: {c: 200, b: 13}})).toEqual({a: {b: 13, c: 200}})
    expect(mergeObjects({a: {c: 200, b: 13}}, {a: {b: 100}})).toEqual({a: {b: 100, c: 200}})
  });
});