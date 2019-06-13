import React, { Component } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { Link } from "react-router-dom";

import Api from "service/Api";
const api = new Api();
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: []
    };

    this.selectionref = React.createRef();
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

  handleDelete(prop, key) {
    api.deleteData("/api/users/" + prop.id).then(result => {
      console.log(result);
    });
  }
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">All Users</CardTitle>
                  <i className="col nc-icon nc-simple-add text-success" />
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

export default Users;
