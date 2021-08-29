const {importStyle} = require("./../../../core/utils/import-style");
const path = require("path");
const {html} = require("../../../core/parser/html");

class ApiDescriptionList {
  constructor(node) {
    this.node = node;
  }
  
  static get style() {
    return importStyle(path.resolve(__dirname, './api-description-list.scss'))
  }
  
  static get customAttributes() {
    return {
      descriptions: {execute: true},
    };
  }
  
  render() {
    const descriptions = this.node.getAttribute('descriptions');
    
    return html(`
      <dl class="api-description-list">
        <fragment #repeat="descriptions as desc">
          <dt>{desc.concept}</dt>
          <dd><span>{desc.type}</span> : {desc.description}</dd>
        </fragment>
      </dl>`, {descriptions});
  }
}

module.exports.ApiDescriptionList = ApiDescriptionList;
