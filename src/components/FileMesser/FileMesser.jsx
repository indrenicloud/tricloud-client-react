import React, { Component, Fragment } from "react";
import { Card, CardBody, CardHeader, CardTitle, Table, Row, Col } from "reactstrap";
import "./FileMesser.css";

export default class FileMesser extends Component {
  constructor(props) {
    super(props);
    this.dataloaded = true;
    this.outData.bind(this);
    this.inData.bind(this);
    this.myDirData = "Nothingness";
    this.state = {
      currentdir: []
    };
  }

  outData() {
    console.log("clicked fm");
    this.props.listfileSend("./");
  }

  inData(data) {
    this.myDirData = data.FSNodes;
    this.setState({
      currentdir: data
    });
  }

  render() {
    return (
      this.dataloaded && (
        <div>
          <h3>Just Messing around</h3>
          {Object.keys(this.myDirData).map(index => (
            <p>
              {this.myDirData[index].Name} {this.myDirData[index].Size} {this.myDirData[index].Type}
            </p>
          ))}
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
