const {importStyle} = require('./../../../core/utils/import-style');
const path = require('path');

class SearchField {
  constructor(node) {
    this.node = node;
  }
  
  static get style() {
    return importStyle(path.resolve(__dirname, './search-field.scss'))
  }
  
  render() {
    const style = this.node.getAttribute('style');
    const placeholder = this.node.getAttribute('placeholder');
    
    return `
      <label class="search-field" aria-label="search field" ${style ? `style=${style}` : ''}>
        <input type="search" name="search" ${placeholder ? `placeholder="${placeholder || ''}"` : ''}>
      </label>
    `;
  }
}

module.exports.SearchField = SearchField;
