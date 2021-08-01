const {transform} = require("./../transform");

describe('Repeat Attribute', () => {
  it('should process numeric value repeat', async () => {
    await expect(transform('<li #repeat="3">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 1.0</li><li>item 2.1</li><li>item 3.2</li>')
    await expect(transform('<li #repeat="3" class="item item-{$item}">item {$index+1}</li>'))
      .resolves.toEqual('<li class="item item-1">item 1</li><li class="item item-2">item 2</li><li class="item item-3">item 3</li>')
  });
  
  it('should handle multiple repeats', async () => {
    await expect(transform(`
    <p #repeat="3">first {$item}.{$index}</p>
    <p #repeat="3">second {$item}.{$index}</p>
    `))
      .resolves.toEqual('<p>first 1.0</p><p>first 2.1</p><p>first 3.2</p>\n' +
        '<p>second 1.0</p><p>second 2.1</p><p>second 3.2</p>')
  });
  
  it('should process Array value repeat', async () => {
    await expect(transform('<li #repeat="[2, 4, 6]">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="[2, 4, 6] as numb">item {numb}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="new Array(2, 4, 6)">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="new Array(2, 4, 6) as numb">item {numb}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
  });
  
  it('should process Set value repeat', async () => {
    await expect(transform('<li #repeat="new Set([2, 4, 6])">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="new Set([2, 4, 6]) as numb">item {numb}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="new Set([2, 4, 6])">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="new Set([2, 4, 6]) as numb">item {numb}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
  });
  
  it('should process Map value repeat', async () => {
    await expect(transform('<li #repeat="new Map([[0, 2], [1, 4], [2, 6]])">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="new Map([[0, 2], [1, 4], [2, 6]]) as numb">item {numb}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="new Map([[0, 2], [1, 4], [2, 6]])">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="new Map([[0, 2], [1, 4], [2, 6]]) as numb">item {numb}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
  });
  
  it('should process Object value repeat', async () => {
    await expect(transform('<li #repeat="{0: 2, 1: 4, 2: 6}">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="{0: 2, 1: 4, 2: 6} as numb">item {numb}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="{0: 2, 1: 4, 2: 6}">item {$item}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
    await expect(transform('<li #repeat="{0: 2, 1: 4, 2: 6} as numb">item {numb}.{$index}</li>'))
      .resolves.toEqual('<li>item 2.0</li><li>item 4.1</li><li>item 6.2</li>')
  });
  
  it('should handle nested repeats', async () => {
    await expect(transform('<div #repeat="3">outer<div #repeat="2">inner</div></div>'.replace(/\s+/g, '')))
      .resolves.toEqual(`
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
    it('if invalid value', async () => {
      await expect(transform('<b #repeat>item</b>')).resolves.toEqual('<b>item</b>');
      await expect(transform('<b #repeat="">item</b>')).resolves.toEqual('<b>item</b>');
      await expect(transform('<b #repeat>${item}</b>')).rejects.toThrowError('item is not defined');
      await expect(transform('<b #repeat="">${item}</b>')).rejects.toThrowError('item is not defined');
    });
    
    it('if number is less or equal to zero', async () => {
      await expect(transform('<b #repeat="0">item</b>')).resolves.toEqual('<b>item</b>');
      await expect(transform('<b #repeat="-1">item</b>')).resolves.toEqual('<b>item</b>');
      await expect(transform('<b #repeat="0">${item}</b>')).rejects.toThrowError('item is not defined');
      await expect(transform('<b #repeat="-1">${item}</b>')).rejects.toThrowError('item is not defined');
    });
    
    it('if list is empty', async () => {
      await expect(transform('<b #repeat="[]">item</b>')).resolves.toEqual('<b>item</b>');
      await expect(transform('<b #repeat="{}">item</b>')).resolves.toEqual('<b>item</b>');
      await expect(transform('<b #repeat="[]">${item}</b>')).rejects.toThrowError('item is not defined');
      await expect(transform('<b #repeat="{}">${item}</b>')).rejects.toThrowError('item is not defined');
    });
  })
  
  describe('should work with other attributes', () => {
    it('attr', async () => {
      await expect(transform('<b #attr="class, cls, true" #repeat="3">{$item}</b>'))
        .resolves.toEqual('<b class="cls">1</b><b class="cls">2</b><b class="cls">3</b>');
    });
    
    it('fragment', async () => {
      await expect(transform('<b #fragment #repeat="3">{$item}</b>')).resolves.toEqual('123');
    });
    
    it('if', async () => {
      await expect(transform('<b #if="true" #repeat="3">{$item}</b>'))
        .resolves.toEqual('<b>1</b><b>2</b><b>3</b>');
    });
    
    it('ignore', async () => {
      await expect(transform('<b #ignore #repeat="3">{$item}</b>'))
        .resolves.toEqual('<b>{$item}</b><b>{$item}</b><b>{$item}</b>');
    });
  });
});
