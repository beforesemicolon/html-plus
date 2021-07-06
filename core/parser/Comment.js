const {Text} = require('./Text');

class Comment extends Text {
  constructor(value) {
    super(value);
  }
  
  get type() {
    return 'comment';
  }
  
  toString() {
    return `<!-- ${this.value} -->`;
  }
}

module.exports.Comment = Comment;