const {Attribute} = require("../Attribute");

// if ((expression.trim().match(/^\d+$/g) ?? []).length > 0) {
//   const count = parseInt(expression, 10);
//
//   node.__repeat = (await Promise.all(
//     Array.from({length: count})
//       .map((_, index) => {
//         const nodeClone = parse(node.outerHTML).childNodes[0];
//         nodeClone.removeAttribute('repeat');
//
//         const data = {...scopeData, ['$index']: index}
//
//         if (node.rawTagName === specialTags.fragment || /#fragment/g.test(node.rawAttrs)) {
//           return getNodeChildrenString(nodeClone, options, data);
//         }
//
//         return compileHTMLObject(nodeClone, options, data);
//       })
//   )).join('\n');
//
//   return node.__repeat;
// }

// if (expression.match(/(.+)(?=as\s+[a-zA-Z_][a-zA-Z0-9_$]?)?/g)) {
//   const [data, name] = expression.trim().split('as');
//   const key = name ? `${name}`.trim() : '$item';
//
//   if (data) {
//     const list = await executeCode(`(() => (${data}))()`, {...options.contextData, ...scopeData});
//
//     if (list && typeof list === 'object') {
//       const entries = list instanceof Map || list instanceof Set
//         ? Array.from(list.entries())
//         : Symbol.iterator in list
//           ? list
//           : Object.entries(list);
//
//       node.__repeat = (await Promise.all(
//         entries
//           .map((item, index) => {
//             const [$key, val] = Array.isArray(item) ? item : [index, item];
//             const nodeClone = parse(node.outerHTML).childNodes[0];
//             nodeClone.removeAttribute('repeat');
//
//             const data = {...scopeData, [`${key}`]: val, ['$index']: index, $key};
//
//             if (node.rawTagName === specialTags.fragment || /#fragment/g.test(node.rawAttrs)) {
//               return getNodeChildrenString(nodeClone, options, data);
//             }
//
//             return compileHTMLObject(nodeClone, options, data);
//           })
//       )).join('\n');
//
//       return node.__repeat;
//     }
//   }
// }


class Repeat extends Attribute {
  process(expression, data = {}) {
    if ((expression.trim().match(/^\d+$/g) ?? []).length > 0) {
      const count = Number(expression);
    }
  }
  
  render(tag, value) {
    return value ? tag : null;
  }
}

module.exports.Repeat = Repeat;