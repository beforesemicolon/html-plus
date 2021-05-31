const defineGetter = (obj, name, value) => {
  Object.defineProperty(obj, name, {
    get() {
      return typeof value === 'function' ? value() : value;
    }
  })
}

module.exports.defineGetter = defineGetter;
