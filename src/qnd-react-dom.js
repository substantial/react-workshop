import QndReact from "./qnd-react";
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

// QndReactDom telling React how to update DOM
QndReact.__updater = componentInstance => {
  // logic on how to update the DOM when you call this.setState

  // get the oldVNode stored in __vNode
  const oldVNode = componentInstance.__vNode;
  // find the updated DOM node by calling the render method
  const newVNode = componentInstance.render();

  // update the __vNode property with updated __vNode
  componentInstance.__vNode = reconcile(oldVNode, newVNode);
};

const QndReactDom = {
  render
};

export default QndReactDom;
