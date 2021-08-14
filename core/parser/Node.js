class Node {
  #parentNode = null;
  #context = {};
  
  get parentNode() {
    return this.#parentNode;
  }
  
  set parentNode(value) {
    if (value === null || value instanceof Node) {
      this.#parentNode = value;
    }
  }
  
  get context() {
    return {...this.#parentNode?.context, ...this.#context};
  }
  
  get selfContext() {
    return this.#context;
  }
  
  set context(value) {
    if (value.toString() === '[object Object]') {
      this.#context = value;
    }
  }
  
  setContext(name, value) {
    if (typeof name === 'string') {
      this.#context[name] = value;
    }
  }
}

module.exports.Node = Node;
