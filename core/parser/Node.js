class Node {
  #parentNode;
  
  constructor(parentNode) {
    this.#parentNode = parentNode;
  }
  
  get parentNode() {
    return this.#parentNode;
  }
}

module.exports.Node = Node;
