import QndReact from "./qnd-react";

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

  render() {
    return <p>Count: {this.state.count}</p>;
  }
}
