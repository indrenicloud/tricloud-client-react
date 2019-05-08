import React, { Component } from "react";

export default class TaskManager extends Component {
  constructor(props) {
    super(props);
    this.setState({
      termdata: {}
    });
  }

  updateTerminal = data => {
    console.log(data);
    this.setState({
      termdata: data
    });
  };

  render() {
    let content = "Terminal not running";
    if (this.state != null) {
      content = this.state.termdata;
    }
    return <div>{JSON.stringify(content)}</div>;
  }
}
