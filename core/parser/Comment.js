const {Text} = require('./Text');

// class Comment extends Text {
//   constructor(value) {
//     super(value);
//   }
//
//   get type() {
//     return 'comment';
//   }
//
//   toString() {
//     return `<!-- ${this.value} -->`;
//   }
// }

class Comment extends Text {
  toString() {
    return `<!-- ${this.value.trim()} -->`;
  }
}

module.exports.Comment = Comment;
