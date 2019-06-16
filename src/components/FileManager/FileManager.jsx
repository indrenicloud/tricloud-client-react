import React, { Component, Fragment, createRef } from "react";

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
    this.state = {
      fileslist: [{ Name: ".", Type: ".", Size: "." }]
    };
    this.dataloaded = false;
    this.inData = this.inData.bind(this);
    this.listDir = this.listDir.bind(this);
    this.back = this.back.bind(this);
    this.doAction = this.doAction.bind(this);
    this.FmBodyRef = createRef();
    this.Path = ".";
    this.ParentPath = "";
  }

  inData(data) {
    this.dataloaded = true;
    this.Path = data.Path;
    this.ParentPath = data.ParentPath;
    let files = data.FSNodes;
    if (files == null) {
      files = [];
    }

    this.setState({
      fileslist: files
    });
  }

  componentDidUpdate() {
    if (!this.dataloaded) {
      this.props.SendToWs({ Path: "." }, 11);
    }
  }

  listDir(dname) {
    let path = this.Path + "/" + dname;
    this.props.SendToWs({ Path: path }, 11);
  }
  back() {
    this.props.SendToWs({ Path: this.ParentPath }, 11);
  }

  doAction(actionName) {
    switch (actionName) {
      case "mkdir":
        //pass
        break;
      case "back":
        this.props.SendToWs({ Path: this.ParentPath }, 11);
        break;
      default:
        break;
    }
  }

  render() {
    return (
      this.dataloaded && (
        <div>
          <Navbar className="fm-nav">
            <FmHead path={this.Path} doaction={this.doAction} />
          </Navbar>
          <FmBody
            files={this.state.fileslist}
            listDir={this.listDir}
            path={this.Path}
          />
        </div>
      )
    );
  }
}
