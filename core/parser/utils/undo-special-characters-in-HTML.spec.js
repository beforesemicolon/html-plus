const {undoSpecialCharactersInHTML} = require('./undo-special-characters-in-HTML');

describe('undoSpecialCharactersInHTML', () => {
  it('should replace undo special chars in attributes', () => {
    expect(undoSpecialCharactersInHTML(`
    <variable name="title" value="list.find(item =&gt; item.name === 'sample' && item.size &lt;= 3)"></variable>
    <ul #if="list.length &gt; 0">
      <li #repeat="list">item</li>
    </ul>
    `.replace(/\s+/g, ''))).toEqual(`
    <variable name="title" value="list.find(item => item.name === 'sample' && item.size <= 3)"></variable>
    <ul #if="list.length > 0">
        <li #repeat="list">item</li>
    </ul>
    `.replace(/\s+/g, ''));
  });
});