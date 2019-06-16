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

class FmBody extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">File size</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            {this.props.files
              .filter(f => {
                if (f.Name.startsWith(".")) {
                  return false;
                }
                return true;
              })
              .map(file => (
                <tr onClick={e => this.props.listDir(file.Name)}>
                  <th>{file.Name}</th>
                  <th>{file.Size}</th>
                  <th>{file.Type}</th>
                </tr>
              ))}
            ;
          </tbody>
        </table>
      </div>
    );
  }
}

export default FmBody;
