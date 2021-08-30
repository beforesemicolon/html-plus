const {selectors, pseudoClass} = require('./regexPatterns');

class Selector{
   operator = null;
   modifier = null;
   
   constructor(type, name = null, value = null) {
      this.type = type;
      this.name = name;
      this.value = value;
   }
}

function createSelectors(selectorString) {
   let selectorsList = [];
   let match;
   
   while((match = selectors.exec(selectorString)) !== null) {
      let selector = null;
      // console.log('match', match[0]);
      
      switch (true) {
         case match[0].startsWith('#'):
            selector = new Selector('attribute', 'id', match[8]);
            break;
         case match[0].startsWith('.'):
            selector = new Selector('attribute', 'class', match[8]);
            break;
         case match[0].startsWith(':') && pseudoClass.test(match[0]):
            selector = new Selector('pseudo-class', match[2], match[3]);
            break;
         case match[0].startsWith('[') && match[0].endsWith(']'):
            selector = new Selector('attribute', match[2] || match[4], match[6]);
            
            if (match[5]) {
               selector.operator = match[5];
            }
   
            if (match[7]) {
               selector.modifier = match[7];
            }
            
            break;
         case match[0] === '*':
            selector = new Selector('global');
            break;
         case /^\s+$/.test(match[0]):
            selector = new Selector('descendent', null, ' ');
            break;
         case match[1] === '+':
            selector = new Selector('sibling', null,'+');
            break;
         case match[1] === '~':
            selector = new Selector('sibling', null,'~');
            break;
         case match[1] === '>':
            selector = new Selector('descendent', null,'>');
            break;
         default:
            if (match[8] && /[a-z][\w-]*/i.test(match[8])) {
               selector = new Selector('tag', match[8]);
            }
      }
      
      if (selector) {
         selectorsList.push(selector);
      } else {
         /**
          * if any selector fails, the whole selector is invalid
          * @type {*[]}
          */
         selectorsList = [];
         break;
      }
   }
   
   return selectorsList;
}

module.exports.createSelectors = createSelectors;
