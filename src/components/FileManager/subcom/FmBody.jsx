import React from "react";
import { Card, CardBody, CardHeader, CardTitle, Table, Row, Col, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, InputGroup, InputGroupText, InputGroupAddon, Input } from "reactstrap";
import FmHead from "./FmHead";

const FileOrFolder = f => {
  if (f == "dir") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" focusable="false" fill="#4492a7">
        <path d="M20 8H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4H24l-4-4z" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="#4492a7" focusable="false">
        <path d="M12 4C9.79 4 8.02 5.79 8.02 8L8 40c0 2.21 1.77 4 3.98 4H36c2.21 0 4-1.79 4-4V16L28 4H12zm14 14V7l11 11H26z" />
      </svg>
    );
  }
};

class FmBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selections: [] };
    this.Path = this.props.path;
    this.addToSelection = this.addToSelection.bind(this);
    this.getClass = this.getClass.bind(this);
    this.getSelections = this.getSelections.bind(this);
  }

  addToSelection(filename) {
    let newArr = [...this.state.selections];

    if (newArr.includes(filename)) {
      var index = newArr.indexOf(filename);
      if (index > -1) {
        newArr.splice(index, 1);
      }
    } else {
      newArr.push(filename);
    }
    this.setState({ selections: newArr });
    this.props.addtoSelections(newArr);
  }

  getClass(filename) {
    if (this.state.selections.includes(filename)) {
      return "thead-dark";
    } else {
      return "";
    }
  }

  getSelections() {
    return [...this.state.selections];
  }

  componentWillReceiveProps({ path }) {
    if (path != this.Path) {
      this.Path = path;
      this.setState({ selections: [] });
    }
  }

  render() {
    return (
      <div>
        <Table responsive className="table-striped">
          <thead>
            <tr>
              <th scope="col">File Name</th>
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
                <tr onDoubleClick={e => (file.Type === "dir" ? this.props.listDir(file.Name) : "")} onClick={e => this.addToSelection(file.Name)} className={this.getClass(file.Name)}>
                  <th>
                    {FileOrFolder(file.Type)}
                    {file.Name}
                  </th>
                  <th>{file.Size}</th>
                  <th>{file.Type}</th>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default FmBody;
