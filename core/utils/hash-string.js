const {createHash} = require('crypto');

/**
 * sha256 hash any string
 * @param content
 * @returns {string}
 */
function hashString(content, algo = 'sha256') {
  const hash = createHash(algo);
  hash.write(content)
  return hash.digest('hex');
}

module.exports.hashString = hashString;
