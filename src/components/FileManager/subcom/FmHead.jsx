import React, { Component, Fragment } from "react";
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

export default class FmHead extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container fluid>
        <div className="navarrow-cont">
          <button
            className="navarrow"
            onClick={e => this.props.doaction("back")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
            >
              <path d="M30.83 32.67l-9.17-9.17 9.17-9.17L28 11.5l-12 12 12 12z" />
            </svg>
          </button>
          <button className="navarrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
            >
              <path d="M17.17 32.92l9.17-9.17-9.17-9.17L20 11.75l12 12-12 12z" />
            </svg>
          </button>
        </div>
        <div>
          <input className="form-control" value={this.props.path} />
        </div>
        <div>
          <button class="navarrow" title="Create folder">
            <div class="oc-svg oc-fm--toolbar__item-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                focusable="false"
              >
                <path d="M40 12H24l-4-4H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4zm-2 16h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z" />
              </svg>
            </div>
          </button>
          <button class="navarrow" title="upload">
            <div class="oc-svg oc-fm--toolbar__item-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                focusable="false"
              >
                <path d="M18 32h12V20h8L24 6 10 20h8zm-8 4h28v4H10z" />
              </svg>
            </div>
          </button>
        </div>
      </Container>
    );
  }
}
