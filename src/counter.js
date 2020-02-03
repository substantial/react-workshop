import QndReact from "./qnd-react";

export default class Counter extends QndReact.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
