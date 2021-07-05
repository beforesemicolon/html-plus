const uniqueAlphaNumericId = (() => {
  const heyStack = '0123456789abcdefghijklmnopqrstuvwxyz';
  const {length} = heyStack;
  const randomInt = () => Math.floor(Math.random() * length);
  
  return (length = 24) => Array.from({length}, () => heyStack[randomInt()]).join('');
})();

module.exports.uniqueAlphaNumericId = uniqueAlphaNumericId;