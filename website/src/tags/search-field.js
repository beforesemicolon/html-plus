const {importStyle} = require('./../../../core/utils/import-style');
const path = require('path');

class SearchField {
  constructor(node) {
    this.attributes = node.attributes;
  }
  
  static get style() {
    return importStyle(path.resolve(__dirname, './search-field.scss'))
  }
  
  render() {
    const {style, placeholder} = this.attributes;
    
    return `
      <label class="search-field" aria-label="search field" ${style ? `style=${style}` : ''}>
        <input type="search" name="search" ${placeholder ? `placeholder="${placeholder || ''}"` : ''}>
      </label>
    `;
  }
}

module.exports.SearchField = SearchField;
