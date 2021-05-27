const defineGetter = (obj, name, value) => {
  Object.defineProperty(obj, name, {
    get() {
      return value();
    }
  })
}

module.exports.defineGetter = defineGetter;
