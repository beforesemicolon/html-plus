const {transform} = require("./../transform");

describe('Repeat Attribute', () => {
  it('should process numeric value repeat', () => {
    expect(transform('<li #repeat="3">item {$item}.{$index}</li>'))
      .toEqual('<li>item 1.0</li><li>item 2.1</li><li>item 3.2</li>')
    expect(transform('<li #repeat="3" class="item item-{$item}">item {$index+1}</li>'))
      .toEqual('<li class="item item-1">item 1</li><li class="item item-2">item 2</li><li class="item item-3">item 3</li>')
  });
  
  it('should handle multiple repeats', () => {
    expect(transform(`
    <p #repeat="3">first {$item}.{$index}</p>
    <p #repeat="3">second {$item}.{$index}</p>
    `))
      .toEqual('<p>first 1.0</p><p>first 2.1</p><p>first 3.2</p>\n' +
        '<p>second 1.0</p><p>second 2.1</p><p>second 3.2</p>')
  });
  
  it('should process Array value repeat', () => {
    expect(transform('<li #repeat="[2, 4, 6]">item {$item}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="[2, 4, 6] as numb">item {numb}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="new Array(2, 4, 6)">item {$item}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="new Array(2, 4, 6) as numb">item {numb}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
  });
  
  it('should process Set value repeat', () => {
    expect(transform('<li #repeat="new Set([2, 4, 6])">item {$item}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="new Set([2, 4, 6]) as numb">item {numb}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="new Set([2, 4, 6])">item {$item}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="new Set([2, 4, 6]) as numb">item {numb}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
  });
  
  it('should process Map value repeat', () => {
    expect(transform('<li #repeat="new Map([[0, 2], [1, 4], [2, 6]])">item {$item}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="new Map([[0, 2], [1, 4], [2, 6]]) as numb">item {numb}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="new Map([[0, 2], [1, 4], [2, 6]])">item {$item}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="new Map([[0, 2], [1, 4], [2, 6]]) as numb">item {numb}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
  });
  
  it('should process Object value repeat', () => {
    expect(transform('<li #repeat="{0: 2, 1: 4, 2: 6}">item {$item}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="{0: 2, 1: 4, 2: 6} as numb">item {numb}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="{0: 2, 1: 4, 2: 6}">item {$item}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    expect(transform('<li #repeat="{0: 2, 1: 4, 2: 6} as numb">item {numb}.{$index}</li>'))
      .toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
  });
  
  it('should handle nested repeats', () => {
    expect(transform('<div #repeat="3">outer<div #repeat="2">inner</div></div>'.replace(/\s+/g, '')))
      .toEqual(`
      <div>
        outer
        <div>inner</div>
        <div>inner</div>
      </div>
      <div>
        outer
        <div>inner</div>
        <div>inner</div>
      </div>
      <div>
        outer
        <div>inner</div>
        <div>inner</div>
      </div>
      `.replace(/\s+/g, ''))
  });
  
  describe('should not repeat', () => {
    it('if invalid value', () => {
      expect(transform('<b #repeat>item</b>')).toEqual('<b>item</b>');
      expect(transform('<b #repeat="">item</b>')).toEqual('<b>item</b>');
      expect(() => transform('<b #repeat>${item}</b>')).toThrowError('item is not defined');
      expect(() => transform('<b #repeat="">${item}</b>')).toThrowError('item is not defined');
    });
    
    it('if number is less or equal to zero', () => {
      expect(transform('<b #repeat="0">item</b>')).toEqual('<b>item</b>');
      expect(transform('<b #repeat="-1">item</b>')).toEqual('<b>item</b>');
      expect(() => transform('<b #repeat="0">${item}</b>')).toThrowError('item is not defined');
      expect(() => transform('<b #repeat="-1">${item}</b>')).toThrowError('item is not defined');
    });
    
    it('if list is empty', () => {
      expect(transform('<b #repeat="[]">item</b>')).toEqual('<b>item</b>');
      expect(transform('<b #repeat="{}">item</b>')).toEqual('<b>item</b>');
      expect(() => transform('<b #repeat="[]">${item}</b>')).toThrowError('item is not defined');
      expect(() => transform('<b #repeat="{}">${item}</b>')).toThrowError('item is not defined');
    });
  })
  
  describe('should work with other attributes', () => {
    it('attr', () => {
      expect(transform('<b #attr="class, cls, true" #repeat="3">{$item}</b>'))
        .toEqual('<b class="cls">1</b><b class="cls">2</b><b class="cls">3</b>');
    });
    
    it('fragment', () => {
      expect(transform('<b #fragment #repeat="3">{$item}</b>')).toEqual('123');
    });
    
    it('if', () => {
      expect(transform('<b #if="true" #repeat="3">{$item}</b>'))
        .toEqual('<b>1</b><b>2</b><b>3</b>');
    });
    
    it('ignore', () => {
      expect(transform('<b #ignore #repeat="3">{$item}</b>'))
        .toEqual('<b>{$item}</b><b>{$item}</b><b>{$item}</b>');
    });
  });
});