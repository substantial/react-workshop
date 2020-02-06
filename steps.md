# Instructions

This is a step by step guide to building your own react.

## Resources

The blog post this is based on:
https://dev.to/ameerthehacker/build-your-own-react-in-90-lines-of-javascript-1je2

My slides:
https://docs.google.com/presentation/d/1WhlKrpJ3_5NM2CNPaYhp-eCBH87Co82V8xNEA5yWyUM

The version of this code I did in typescript:
https://github.com/substantial/subact

### Step 0: Clone the boilerplate

```bash
git clone git@github.com:substantial/react-workshop.git

cd react-workshop
yarn install
yarn start
open http://localhost:3000
```

### Step 1: Add the create element function

```javascript
// file: src/qnd-react.js
const createElement = (type, props = {}, ...children) => {
  console.log(type, props, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement
};

export default QndReact;
```

### Step 3: Add a simple component file

```javascript
// file: src/index.js
// QndReact needs to be in scope for JSX to work
import QndReact from "./qnd-react";

const App = (
  <div>
    <h1 className="primary">QndReact is Quick and dirty react</h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
  </div>
);
```

### Step 4: Add and use snabbdom

```bash
yarn add snabbdom
```

```javascript
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  return h(type, { props }, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement
};

export default QndReact;
```

### Step 5: Create a render function

```javascript
// file: src/qnd-react-dom.js
import * as snabbdom from "snabbdom";
import propsModule from "snabbdom/modules/props";
import eventlistenersModule from "snabbdom/modules/eventlisteners";

const reconcile = snabbdom.init([propsModule, eventlistenersModule]);

// React.render(<App />, document.getElementById('root'));
// el -> <App />
// rootDomElement -> document.getElementById('root')
const render = (el, rootDomElement) => {
  // logic to put el into the rootDomElement
  reconcile(rootDomElement, el);
};

// to be exported like ReactDom.render
const QndReactDom = {
  render
};

export default QndReactDom;
```

### Step 6: Render our index component!

```javascript
// file: src/index.js
import QndReactDom from "./qnd-react-dom";
// ...
QndReactDom.render(App, document.getElementById("root"));
```

Now you should be able to see your component rendering in the browser!

### Step 7: Handle re-renders

```javascript
// file: src/qnd-react-dom.js
import * as snabbdom from "snabbdom";
import propsModule from "snabbdom/modules/props";

// propsModule -> this helps in patching text attributes
const reconcile = snabbdom.init([propsModule]);
// we need to maintain the latest rootDomNode returned by render
let rootVNode;

// React.render(<App />, document.getElementById('root'));
// el -> <App />
// rootDomElement -> document.getElementById('root')
const render = (el, rootDomElement) => {
  // logic to put el into the rootDomElement
  // ie. QndReactDom.render(<App />, document.getElementById('root'));
  // happens when we call render for the first time
  if (rootVNode === undefined) {
    rootVNode = rootDomElement;
  }

  // remember the VNode that reconcile returns
  rootVNode = reconcile(rootVNode, el);
};

// to be exported like ReactDom.render
const QndReactDom = {
  render
};

export default QndReactDom;
```

### Step 8: Add a function component

```javascript
// file: src/index.js
// QndReact needs to be in scope for JSX to work
import QndReact from "./qnd-react";
import QndReactDom from "./qnd-react-dom";

// functional component to welcome someone
const Greeting = ({ name }) => <p>Welcome {name}!</p>;

const App = (
  <div>
    <h1 className="primary">QndReact is Quick and dirty react</h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
    <Greeting name="Robin" />
  </div>
);

QndReactDom.render(App, document.getElementById("root"));
```

### Step 9: Render function components correctly

```javascript
// file: src/qnd-react.js
import { h } from "snabbdom";

const createElement = (type, props = {}, ...children) => {
  // if type is a function then call it and return it's value
  if (typeof type == "function") {
    return type(props);
  }

  return h(type, { props }, children);
};

// to be exported like React.createElement
const QndReact = {
  createElement
};

export default QndReact;
```

### Step 10: Add a Component class

```javascript
// file: src/qnd-react.js
// component base class
class Component {
  constructor() {}

  setState(partialState) {}

  render() {}
}

// to be exported like React.createElement, React.Component
const QndReact = {
  createElement,
  Component
};
```

### Step 11: Add our first class component

```javascript
// file: src/counter.js
import QndReact from "./qnd-react";

export default class Counter extends QndReact.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    console.log("Component mounted");
  }

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
```

And use it on our index.js:

```
// file: src/index.js
const App = (
  <div>
    <h1 className="primary">QndReact is Quick and dirty react</h1>
    <p>It is about building your own React in 90 lines of JavsScript</p>
    <Greeting name="Robin" />
    <Counter />
  </div>
);
```

### Step 12: Handle rendering classes correctly

```javascript
// file: src/qnd-react.js
// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;
```

```javascript
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
```

This is the end of part 1, congratulations!

### Step 13: Handle state

Add some imports:

```javascript
// file: src/qnd-react-dom.js
import QndReact from "./qnd-react";
import * as snabbdom from "snabbdom";
import propsModule from "snabbdom/modules/props";
```

Add the updater function:

```javascript
// QndReactDom telling React how to update DOM
QndReact.__updater = () => {
  // logic on how to update the DOM when you call this.setState

  // get the oldVNode stored in __vNode
  const oldVNode = componentInstance.__vNode;
  // find the updated DOM node by calling the render method
  const newVNode = componentInstance.render();

  // update the __vNode property with updated __vNode
  componentInstance.__vNode = reconcile(oldVNode, newVNode);
};

// to be exported like ReactDom.render
const QndReactDom = {
  render
};

export default QndReactDom;
```

Update createElement to work with classes:

```javascript
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
```

Add the Component class:

```javascript
// file: src/qnd-react.js
// component base class
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
```

Add a counter function component:

```javascript
// file: src/counter.js
export default class Counter extends QndReact.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };

    // update the count every second
    setInterval(() => {
      this.setState({
        count: this.state.count + 1
      });
    }, 1000);
  }

  componentDidMount() {
    console.log("Component mounted");
  }

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
```

### Step 14: Handle state changes

```javascript
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
```

For our onClick handler to work correctly, we have to tell snabbdom about it.

```javascript
// file: src/qnd-react-dom.js
import * as snabbdom from "snabbdom";
import propsModule from "snabbdom/modules/props";
import eventlistenersModule from "snabbdom/modules/eventlisteners";
import QndReact from "./qnd-react";

// propsModule -> this helps in patching text attributes
// eventlistenersModule -> this helps in patching event attributes
const reconcile = snabbdom.init([propsModule, eventlistenersModule]);
```

```javascript
const createElement = (type, props = {}, ...children) => {
  // After the current fuction body

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
```

Now we should have a working counter with a click event and set state.
