class Node {
  #parentNode;
  
  get parentNode() {
    return this.#parentNode;
  }
  
  set parentNode(value) {
    this.#parentNode = value;
  }
}

module.exports.Node = Node;
