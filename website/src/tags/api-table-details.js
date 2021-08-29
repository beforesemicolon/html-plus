const {importStyle} = require("./../../../core/utils/import-style");
const path = require("path");
const {html} = require("../../../core/parser/html");

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
    const name = this.node.getAttribute('name');
    const details = this.node.getAttribute('details');
    const heading = this.node.getAttribute('heading');
    
    return html(`
      <table class="api-reference-details">
        <caption>{name} details</caption>
        <thead>
          <tr>
            <th colspan="2" style="text-align: left">{heading ?? 'Details'}</th>
          </tr>
        </thead>
        <tbody>
          <tr #repeat="details">
              <td>{$key}</td>
              <td><inject html="$item"></inject></td>
          </tr>
        </tbody>
      </table>
    `, {name, details, heading});
  }
}

module.exports.ApiTableDetails = ApiTableDetails;
