import React, { Component, Fragment } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
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

export default class Block extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Card>
            <CardBody>
              <Row>
                <Col>{this.props.children}</Col>
              </Row>
            </CardBody>
            <CardFooter />
          </Card>
        </Col>
      </Row>
    );
  }
}
