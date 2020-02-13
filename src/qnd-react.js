import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a Class then
  // 1. create a instance of the Class
  // 2. call the render method on the Class instance
  if (type.prototype && type.prototype.isQndReactClassComponent) {
    const componentInstance = new type(props);

    // remember the current vNode instance
    componentInstance.__vNode = componentInstance.render();

    return componentInstance.__vNode;
  }

  console.log(type, props, children);
  if (typeof type === "function") {
    return type(props);
  }

  let dataProps = {};
  let eventProps = {};

  // This is to seperate out the text attributes and event listener attributes
  for (let propKey in props) {
    // event props always startwith on eg. onClick, onDblClick etc.
    if (propKey.startsWith("on")) {
      // onClick -> click
      const event = propKey.substring(2).toLowerCase();
      eventProps[event] = props[propKey];
    } else {
      dataProps[propKey] = props[propKey];
    }
  }

  // props -> snabbdom's internal text attributes
  // on -> snabbdom's internal event listeners attributes
  return h(type, { props: dataProps, on: eventProps }, children);
};

class Component {
  constructor() {}

  componentDidMount() {}

  setState(partialState) {
    // update the state by adding the partial state
    this.state = {
      ...this.state,
      ...partialState
    };
    // call the __updater function that QndReactDom gave
    QndReact.__updater(this);
  }

  render() {}
}

// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;

const QndReact = {
  createElement,
  Component
};

export default QndReact;
