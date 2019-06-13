import React, { Component } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { Link } from "react-router-dom";
import withAuth from "components/Login/withAuth";

import Api from "service/Api";
const api = new Api();
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: [],
      modal: false,
      newuser: {
        fullname: "",
        email: "",
        password: "",
        username: ""
      }
    };
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getAllUsers();
  }

  getAllUsers() {
    api.getData("/api/users").then(result => {
      if (result.data.length > 0) {
        this.setState({
          all_users: result.data
        });
      }
    });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onChange(e) {
    const { newuser } = { ...this.state };
    const currentState = newuser;
    const { name, value } = e.target;
    currentState[name] = value;
    this.setState({ newuser: currentState });
  }

  handleSubmit(e) {
    const form = {
      id: this.state.newuser.username,
      password: this.state.newuser.password,
      email: this.state.newuser.email,
      fullname: this.state.newuser.fullname
    };
    api.postData("/api/users", form).then(resp => {
      console.log(resp);
      this.setState({
        modal: !this.state.modal,
        all_users: resp.data
      });
    });
    e.preventDefault();
  }

  handleDelete(prop, key) {
    api.deleteData("/api/users/" + prop.id).then(result => {
      console.log(result);
    });
  }
  render() {
    return (
      <>
        <div className="content">
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <form>
              <ModalHeader>Add New User</ModalHeader>
              <ModalBody>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Username: </label>
                    <input type="text" name="username" value={this.state.newuser.username} onChange={this.onChange} className="form-control" />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Password:</label>
                    <input type="password" name="password" value={this.state.newuser.password} onChange={this.onChange} className="form-control" />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Full Name:</label>
                    <input type="text" name="fullname" value={this.state.newuser.fullname} onChange={this.onChange} className="form-control" />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Email:</label>
                    <input type="email" name="email" value={this.state.newuser.email} onChange={this.onChange} className="form-control" />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.handleSubmit}>
                  Add
                </Button>{" "}
                <Button color="secondary" onClick={this.toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </Modal>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">All Users</CardTitle>
                  <i className="col nc-icon nc-simple-add text-success" onClick={this.toggle} />
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.all_users.map((prop, key) => {
                        return (
                          <tr>
                            <td>{prop.fullname}</td>
                            <td>{prop.email}</td>
                            <td>{prop.id}</td>
                            <td>{prop.superuser == true ? "Admin" : "Normal"}</td>
                            <td>
                              <div className="row">
                                <Link to={``}>
                                  <i className="col nc-icon nc-button-play text-success" />
                                </Link>
                                <i className="col nc-icon nc-simple-remove text-danger deleteagent" onClick={() => this.handleDelete(prop, key)} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default withAuth(Users);
