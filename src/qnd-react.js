import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a Class then
  // 1. create a instance of the Class
  // 2. call the render method on the Class instance
  if (type.prototype && type.prototype.isQndReactClassComponent) {
    const componentInstance = new type(props);

    return componentInstance.render();
  }

  console.log(type, props, children);
  if (typeof type === "function") {
    return type(props);
  }
  return h(type, { props }, children);
};

class Component {
  constructor() {}

  componentDidMount() {}

  setState(partialState) {}

  render() {}
}

// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;

const QndReact = {
  createElement,
  Component
};

export default QndReact;
