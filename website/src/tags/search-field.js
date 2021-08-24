const {importStyle} = require('./../../../core/utils/import-style');
const path = require('path');
const {html} = require("../../../core/parser/html");

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
    
    return html(`
      <label class="search-field" aria-label="search field" #attr="style, {style}, style">
        <input type="search" name="search" #attr="placeholder, {placeholder}, placeholder">
      </label>
    `, {placeholder, style});
  }
}

module.exports.SearchField = SearchField;
