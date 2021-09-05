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
   selectorString = selectorString.trim();
   
   if (/^(\+|\~|\>)/.test(selectorString)) {
       throw new Error('Invalid selector string: It may not start with any combinator symbol.')
   }
   
   let selectorsList = [];
   let match;
   let lastSelector = null;
   selectors.lastIndex = 0
   
   while((match = selectors.exec(selectorString)) !== null) {
      let selector = null;
      
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
            selector = new Selector('combinator', null, ' ');
            break;
         case match[1] === '+':
         case match[1] === '~':
         case match[1] === '>':
            selector = new Selector('combinator', null, match[1]);
            break;
         default:
            if (match[8] && /[a-z][\w-]*/i.test(match[8])) {
               selector = new Selector('tag', match[8]);
            }
      }
      
      if (selector) {
         if (lastSelector && lastSelector.type === 'combinator' && lastSelector.type === selector.type) {
            throw new Error('Invalid selector string: Must not contain nested combinator symbols.')
         }
         
         selectorsList.push(selector);
         lastSelector = selector;
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
