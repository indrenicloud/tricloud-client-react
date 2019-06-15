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
    this.dataloaded = false;
    this.inData.bind(this);
    this.state = {
      fileslist: [{ Name: ".", Type: ".", Size: "." }]
    };
  }

  inData(data) {
    this.dataloaded = true;
    this.setState({
      fileslist: data.FSNodes
    });
  }

  componentDidUpdate() {
    if (!this.dataloaded) {
      this.props.SendToWs({ Path: "." }, 11);
    }
  }

  render() {
    return (
      this.dataloaded && (
        <div>
          <Navbar className="fm-nav">
            <FmHead />
          </Navbar>
          <FmBody files={this.state.fileslist} />
        </div>
      )
    );
  }
}
