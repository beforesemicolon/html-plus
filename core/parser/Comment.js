const {Text} = require('./Text');

class Comment extends Text {
  toString() {
    return `<!-- ${this.value.trim()} -->`;
  }
}

module.exports.Comment = Comment;
