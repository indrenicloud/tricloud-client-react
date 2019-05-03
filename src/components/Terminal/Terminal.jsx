import React, { Component } from "react";

import { Terminal as xTerm } from "xterm";

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.myref = React.createRef();
    this.onMessage = this.onMessage.bind(this);
    this.outputFromAgent = this.outputFromAgent.bind(this);
    this.xterm = new xTerm();
  }

  // input and stuff from xtermjs
  onMessage(data) {
    console.log(typeof data);
    console.log(data);
    this.props.sendtows(data);
  }

  outputFromAgent(output) {
    console.log("VERY NEAR:", output);
    //this.xterm.write(output)
  }

  componentDidMount() {
    this.xterm.open(this.myref.current);
    this.xterm.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
    this.xterm.on("data", this.onMessage);
  }

  render() {
    return <div ref={this.myref} />;
  }
}

export default Terminal;
