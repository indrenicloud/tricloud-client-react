import React, { Component } from "react";

import { Terminal as xTerm } from "xterm";
import './Terminal.css';
import * as fit from 'xterm/lib/addons/fit/fit';

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.myref = React.createRef();
    this.onMessage = this.onMessage.bind(this);
    this.outputFromAgent = this.outputFromAgent.bind(this);
   
  }

  // input and stuff from xtermjs
  onMessage(data) {
    console.log(typeof data);
    console.log(data);
    this.props.sendtows(data);
  }

  outputFromAgent(output) {
    console.log("VERY NEAR:", output);
    this.xterm.write(output);
  }

  componentDidMount() {
    xTerm.applyAddon(fit);
    this.xterm = new xTerm(this.props.options);
    this.xterm.open(this.myref.current);
    this.xterm.fit();

    this.xterm.write("TriCloud \x1B[1;3;31mTerminal\x1B[0m $ ");
    this.xterm.on("data", this.onMessage);
  }

  render() {
    return <div ref={this.myref} style={{
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      height: '100%',
    }}
    options={{
      cols: 80,
      rows: 24,
      cursorBlink: false,
    }} />;
  }
}

export default Terminal;
