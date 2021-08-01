const {importStyle} = require("./../../../core/utils/import-style");
const path = require("path");

class ApiTableDetails {
  constructor(node) {
    this.node = node;
  }
  
  static get style() {
    return importStyle(path.resolve(__dirname, './api-table-details.scss'))
  }
  
  static get customAttributes() {
    return {
      details: {execute: true},
    };
  }
  
  render() {
    const {name, details, heading} = this.node.attributes;
    
    return `
      <table class="api-reference-details">
        <caption>${name} details</caption>
        <thead>
          <tr>
            <th colspan="2" style="text-align: left">${heading ?? 'Details'}</th>
          </tr>
        </thead>
        <tbody>
            ${
              Object.keys(details).map(key => `
                <tr>
                    <td>${key}</td>
                    <td>${details[key]}</td>
                </tr>
              `).join('')
            }
        </tbody>
      </table>
    `
  }
}

module.exports.ApiTableDetails = ApiTableDetails;
