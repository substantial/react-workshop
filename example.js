// https://dev.to/ameerthehacker/build-your-own-react-in-90-lines-of-javascript-1je2
//
// https://docs.google.com/presentation/d/1WhlKrpJ3_5NM2CNPaYhp-eCBH87Co82V8xNEA5yWyUM
//
// https://github.com/substantial/subact


0. Clone the boilerplate

git clone git@github.com:substantial/react-workshop.git

cd react-workshop
yarn install
yarn start
open http://localhost:3000

1. Setup jsx babel plugin

yarn add @babel/plugin-transform-react-jsx

{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "pragma": "QndReact.createElement", // default pragma is React.createElement
      "throwIfNamespace": false // defaults to true
    }]
  ]
}

2. Add the create element function

// file: src/qnd-react.js
const createElement = (type, props = {}, ...children) => {
  console.log(type, props, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement
};

export default QndReact;

3. Add a simple component file

// file: src/index.js
// QndReact needs to be in scope for JSX to work
import QndReact from "./qnd-react";

const App = (
  <div>
    <h1 className="primary">
      QndReact is Quick and dirty react
    </h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
  </div>
);

4. Add and use snabbdom

yarn add snabbdom

// file: src/qnd-react.js
import { h } from 'snabbdom';

const createElement = (type, props = {}, ...children) => {
  return h(type, { props }, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement
};

export default QndReact;


5. Create a render function

// file: src/qnd-react-dom.js

// React.render(<App />, document.getElementById('root'));
// el -> <App />
// rootDomElement -> document.getElementById('root')
const render = (el, rootDomElement) => {
  // logic to put el into the rootDomElement
  reconcile(rootDomElement, el);
}

// to be exported like ReactDom.render
const QndReactDom = {
  render
};

export default QndReactDom;


6. Render our index component!

// file: src/index.js
QndReactDom.render(App, document.getElementById('root'));

7. Handle re-renders

// file: src/qnd-react-dom.js
import * as snabbdom from 'snabbdom';
import propsModule from 'snabbdom/modules/props';

// propsModule -> this helps in patching text attributes
const reconcile = snabbdom.init([propsModule]);
// we need to maintain the latest rootVNode returned by render
let rootVNode;

// React.render(<App />, document.getElementById('root'));
// el -> <App />
// rootDomElement -> document.getElementById('root')
const render = (el, rootDomElement) => {
  // logic to put el into the rootDomElement
  // ie. QndReactDom.render(<App />, document.getElementById('root'));
  // happens when we call render for the first time
  if(rootVNode === undefined) {
    rootVNode = rootDomElement;
  }

  // remember the VNode that reconcile returns
  rootVNode = reconcile(rootVNode, el);
}

// to be exported like ReactDom.render
const QndReactDom =  {
  render
};

export default QndReactDom;

8. Add a function component

// file: src/index.js
// QndReact needs to be in scope for JSX to work
import QndReact from "./qnd-react";
import QndReactDom from "./qnd-react-dom";

// functional component to welcome someone
const Greeting = ({ name }) => <p>Welcome {name}!</p>;

const App = (
  <div>
    <h1 className="primary">
      QndReact is Quick and dirty react
    </h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
    <Greeting name={"Ameer Jhan"} />
  </div>
);

QndReactDom.render(App, document.getElementById("root"));


9. Render function components correctly

// file: src/qnd-react.js
import { h } from 'snabbdom';

const createElement = (type, props = {}, ...children) => {
  // if type is a function then call it and return it's value
  if (typeof (type) == 'function') {
    return type(props);
  }

  return h(type, { props }, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement
};

export default QndReact;


10. Add a Component class

// file: src/qnd-react-dom.js
// component base class
class Component {
  constructor() { }

  componentDidMount() { }

  setState(partialState) { }

  render() { }
}

// to be exported like React.createElement, React.Component
const QndReact = {
  createElement,
  Component
};


11. Add our first class component

// file: src/counter.js
import QndReact from './qnd-react';

export default class Counter extends QndReact.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    }
  }

  componentDidMount() {
    console.log('Component mounted');
  }

  render() {
    return <p>Count: {this.state.count}</p>
  }
}

// And use it on our index.js
// file: src/index.js
const App = (
  <div>
    <h1 className="primary">
      QndReact is Quick and dirty react
    </h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
    <Greeting name={"Ameer Jhan"} />
    <Counter />
  </div>
);

12. Handle rendering classes correctly

// file: src/qnd-react.js
// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;

// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a Class then
  // 1. create a instance of the Class
  // 2. call the render method on the Class instance
  if (type.prototype && type.prototype.isQndReactClassComponent) {
    const componentInstance = new type(props);

    return componentInstance.render();
  }
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

13. Handle state

// file: src/qnd-react-dom.js
import QndReact from './qnd-react';
import * as snabbdom from 'snabbdom';
import propsModule from 'snabbdom/modules/props';

...

// QndReactDom telling React how to update DOM
QndReact.__updater = () => {
  // logic on how to update the DOM when you call this.setState

  // get the oldVNode stored in __vNode
  const oldVNode = componentInstance.__vNode;
  // find the updated DOM node by calling the render method
  const newVNode = componentInstance.render();

  // update the __vNode property with updated __vNode
  componentInstance.__vNode = reconcile(oldVNode, newVNode);
}

// to be exported like ReactDom.render
const QndReactDom =  {
  render
};

export default QndReactDom;


// file: src/qnd-react.js
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
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

// component base class
class Component {
  constructor() { }

  componentDidMount() { }

  setState(partialState) {
    // update the state by adding the partial state
    this.state = {
      ...this.state,
      ...partialState
    }
    // call the __updater function that QndReactDom gave
    QndReact.__updater(this);
  }

  render() { }
}

// file: src/counter.js
export default class Counter extends QndReact.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    }

    // update the count every second
    setInterval(() => {
      this.setState({
        count: this.state.count + 1
      })
    }, 1000);
  }

  componentDidMount() {
    console.log('Component mounted');
  }

  render() {
    return <p>Count: {this.state.count}</p>
  }
}


14. Handle state changes

// file: src/counter.js
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({
          count: this.state.count + 1
        })}>Increment</button>
      </div>
    )
  }

