import * as snabbdom from "snabbdom";
import propsModule from "snabbdom/modules/props";

// propsModule -> this helps in patching text attributes
const reconcile = snabbdom.init([propsModule]);
let rootNode;

const render = (el, rootDomElement) => {
  if (rootNode === undefined) {
    rootNode = rootDomElement;
  }
  // logic to put el into the rootDomElement
  reconcile(rootNode, el);
};

const QndReactDom = {
  render
};

export default QndReactDom;
