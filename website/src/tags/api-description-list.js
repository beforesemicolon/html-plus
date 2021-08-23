const {importStyle} = require("./../../../core/utils/import-style");
const path = require("path");

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
    
    return `
    <dl class="api-description-list">
      ${descriptions
        .map(desc => `
            <dt>${desc.concept}</dt>
            <dd><span>${desc.type}</span> : ${desc.description}</dd>`)
        .join('')
      }
    </dl>`;
  }
}

module.exports.ApiDescriptionList = ApiDescriptionList;
