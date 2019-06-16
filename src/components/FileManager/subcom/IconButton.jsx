import React, { Component } from "react";

export default class Ficon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button
        className="navarrow"
        onClick={e => this.props.doaction(this.props.name)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          {this.props.children}
        </svg>
      </button>
    );
  }
}
