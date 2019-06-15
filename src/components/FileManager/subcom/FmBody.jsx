import React from "react";
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
import FmHead from "./FmHead";

function FmBody() {
  return (
    <div>
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">File size</th>
            <th scope="col">Last modified</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Pictures</th>
            <td>79GB</td>
            <td>2019-05-28 23:52:14</td>
          </tr>
          <tr>
            <th scope="row">Files</th>
            <td>13TB</td>
            <td>2019-06-15 13:21:03</td>
          </tr>
          <tr>
            <th scope="row">NuclearCodes.txt</th>
            <td>5KB</td>
            <td>2017-02-15 06:53:17</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FmBody;
