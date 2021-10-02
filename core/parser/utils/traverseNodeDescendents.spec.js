const {parseHTMLString, Element} = require("../Element");
const {traverseNodeDescendents} = require("./traverseNodeDescendents");
const {traverseNodeAncestors} = require("./traverseNodeAncestors");

describe('traverseNodeDescendents', () => {
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
  
  it('should traverse node descendants', () => {
    const descendents = [];
  
    traverseNodeDescendents(node, (n) => {
      descendents.push(n);
    })
  
    expect(descendents.map(n => n.tagName)).toEqual([
      "section",
      "h2",
      "ul",
      "a",
      "li",
      "li",
      "li",
      "li",
      "li",
      "span",
      "ul",
      "li",
      "li"
    ])
  });
  
  it('should traverse node descendants and quit early', () => {
    const descendents = [];
    
    traverseNodeDescendents(node, (n) => {
      descendents.push(n);
      
      if(n.matches('.special-item')) {
        return true
      }
    })
    
    expect(descendents.map(n => n.tagName)).toEqual([
      "section",
      "h2",
      "ul",
      "a",
      "li",
      "li",
      "li",
      "li",
      "li"
    ])
  });
  
  it('should not loop if node has no descendants', () => {
    const cb = jest.fn();
    
    traverseNodeAncestors(new Element('div'), cb)
    
    expect(cb).not.toHaveBeenCalled();
  });
});
