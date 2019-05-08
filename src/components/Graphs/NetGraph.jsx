import React, { Component } from "react";

export default class NetGraph extends Component {
  constructor(props) {
    super(props);
    this.divref = React.createRef();
  }

  componentDidMount() {
    let componentheight = document.getElementById("net_usage").clientHeight;
    let componentwidth = document.getElementById("net_usage").clientWidth;
  }
  componentDidUpdate() {
    let componentheight = document.getElementById("net_usage").clientHeight;
    let componentwidth = document.getElementById("net_usage").clientWidth;
  }




  render() {
    return (
      <div
        id={"net_usagegraph"}
        key={this.divref}
        style={{ height: 120 + "px" }}
      />
    );
  }
}

