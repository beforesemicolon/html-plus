const {importStyle} = require("./../../../core/utils/import-style");
const path = require("path");

class ContentNavigation {
  constructor(node) {
    this.node = node;
  }
  
  static get style() {
    return importStyle(path.resolve(__dirname, './content-navigation.scss'))
  }
  
  static get customAttributes() {
    return {
      currentPage: {execute: true},
    };
  }
  
  render() {
    const {currentPage} = this.node.attributes;
    
    if (currentPage?.next || currentPage?.prev) {
      return `
        <ul role="menu" id="documentation-menu" aria-label="Content Navigation Menu">
          ${
            currentPage.prev
              ? `<li class="prev">
                    <a href="${currentPage.prev.path}">${currentPage.prev.title.replace(/([><])/g, m => m === '<' ? '&lt;' : '&gt;')}</a>
                  </li>`
              : ''
          }
          ${
            currentPage.next
              ? `<li #if="" class="next">
                        <a href="${currentPage.next.path}">${currentPage.next.title.replace(/([><])/g, m => m === '<' ? '&lt;' : '&gt;')}</a>
                      </li>`
              : ''
          }
        </ul>
      `;
    }
    
    return null;
  }
}

module.exports.ContentNavigation = ContentNavigation;
