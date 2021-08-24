const {importStyle} = require("./../../../core/utils/import-style");
const path = require("path");
const {html} = require("../../../core/parser/html");

class ContentNavigation {
  constructor(node) {
    this.node = node;
  }
  
  static get style() {
    return importStyle(path.resolve(__dirname, './content-navigation.scss'))
  }
  
  static get customAttributes() {
    return {
      currentpage: {execute: true},
    };
  }
  
  render() {
    const currentPage = this.node.getAttribute('currentpage');
    
    if (currentPage?.next || currentPage?.prev) {
      return html(`
        <ul role="menu" id="documentation-menu" aria-label="Content Navigation Menu">
            <li class="prev" #if="currentPage.prev">
              <a href="{currentPage.prev.path}">
                <ignore value="currentPage.prev.title" escape></ignore>
              </a>
            </li>
            <li class="next" #if="currentPage.next">
              <a href="{currentPage.next.path}">
                <ignore value="currentPage.next.title" escape></ignore>
              </a>
            </li>
        </ul>
      `, {currentPage})
    }
    
    return null;
  }
}

module.exports.ContentNavigation = ContentNavigation;
