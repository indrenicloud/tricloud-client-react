import React, { Component, Fragment } from "react";

import FmHead from "./subcom/FmHead";
import FmBody from "./subcom/FmBody";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input
} from "reactstrap";
import "./FileManager.css";

export default class FileManager extends Component {
  constructor(props) {
    super(props);
    this.dataloaded = true;
    this.inData.bind(this);
    this.myDirData = "Nothingness";
    this.state = {
      currentdir: []
    };

    //this.props.SendToWs({ Path: "./" }, 12);
  }

  inData(data) {
    this.myDirData = data.FSNodes;

    this.setState({
      currentdir: data
    });
  }

  componentDidUpdate() {
    if (!this.dataloaded) {
      this.props.SendToWs({ Path: "./" }, 11);
    }
    this.dataloaded = true;
  }

  render() {
    return (
      this.dataloaded && (
        <div>
          <Navbar className="fm-nav">
            <FmHead />
          </Navbar>
          <FmBody />
        </div>
      )
    );
  }
}

/* 

<div>
          <h3>Just Messing around</h3>
          {Object.keys(this.myDirData).map(index => (
            <p>
              {this.myDirData[index].Name} {this.myDirData[index].Size}{" "}
              {this.myDirData[index].Type}
            </p>
          ))}
          <button
            onClick={event => {
              console.log("clicked fm");
              this.props.SendToWs({ Path: "./" }, 11);
            }}
          >
            Refresh{" "}
          </button>
        </div>

*/
