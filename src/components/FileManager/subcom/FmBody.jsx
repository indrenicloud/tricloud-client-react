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
                <tr
                  onDoubleClick={e => this.props.listDir(file.Name)}
                  onClick={e => this.addToSelection(file.Name)}
                  className={this.getClass(file.Name)}
                >
                  <th>{file.Name}</th>
                  <th>{file.Size}</th>
                  <th>{file.Type}</th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FmBody;
