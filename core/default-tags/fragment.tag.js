const {Tag} = require('../Tag');

class Fragment extends Tag {
  async render() {
    return await this.renderChildren();
  }
}

module.exports.Fragment = Fragment;