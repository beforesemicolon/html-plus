const {parseHTMLString, Element} = require("../Element");
const {traverseNodeAncestors} = require("./traverseNodeAncestors");

describe('traverseNodeAncestors', () => {
  const node = parseHTMLString(`
    <section class="block">
      <h2 id="main-title">Some title</h2>
      <ul class="list">
          <li class="item" name="">item 1</li>
          <li class="item">item 2</li>
          <li class="item">item 3</li>
          <li class="item">item 4</li>
          <li class="item special-item">
              <span>more</span>
              <ul class="sub-menu" id="more-menu">
                <li>sub item 1</li>
                <li class="last">sub item 2</li>
              </ul>
          </li>
      </ul>
      <a href="/path/to/page" download class="">view</a>
    </section>
  `);
  
  it('should traverse up the node ancestors', () => {
    const lastLi = node.querySelector('.last');
    const ancestors = [];
  
    traverseNodeAncestors(lastLi, (n) => {
      ancestors.push(n);
    })
    
    expect(ancestors.map(n => n.tagName)).toEqual(["ul", "li", "ul", "section", null])
  });
  
  it('should traverse up the node ancestors and quit early', () => {
    const lastLi = node.querySelector('.last');
    const ancestors = [];
    
    traverseNodeAncestors(lastLi, (n) => {
      ancestors.push(n);
      
      if (n.tagName === 'li') {
          return true
      }
    })
    
    expect(ancestors.map(n => n.tagName)).toEqual(["ul", "li"])
  });
  
  it('should not loop if node has no parent', () => {
    const cb = jest.fn();
  
    traverseNodeAncestors(new Element('span'), cb)
  
    expect(cb).not.toHaveBeenCalled();
  });
});
