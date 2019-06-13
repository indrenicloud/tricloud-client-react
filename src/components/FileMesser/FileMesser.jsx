import React, { Component, Fragment } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";
import "./FileMesser.css";

export default class FileMesser extends Component {
  constructor(props) {
    super(props);
    this.dataloaded = true;
    this.outData.bind(this);
    this.inData.bind(this);
    this.myDirData = "Nothingness";
  }

  outData() {
    console.log("clicked fm");
    this.props.listfileSend("./");
  }

  inData(data) {
    this.myDirData = JSON.stringify(data);
    console.log(data);
  }

  render() {
    return (
      this.dataloaded && (
        <div>
          <h3>Just Messing around {this.myDirData}</h3>
          <button
            onClick={event => {
              console.log("clicked fm");
              this.props.listfileSend("./");
            }}
          >
            List Dir{" "}
          </button>
        </div>
      )
    );
  }
}
