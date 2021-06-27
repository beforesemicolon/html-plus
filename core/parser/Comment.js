const {Text} = require('./Text');

class Comment extends Text {
  get type() {
    return 'comment';
  }
  
  toString() {
    return `<!-- ${this.value} -->`;
  }
}

module.exports.Comment = Comment;