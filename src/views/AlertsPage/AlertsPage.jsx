import React, { Component } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { Link } from "react-router-dom";
import withAuth from "components/Login/withAuth";
import Api from "../../service/Api";

const api = new Api();
class AlertsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.userid = this.props.match.params.userId;
    this.getAlerts = this.getAlerts.bind(this);
  }

  componentDidMount() {
    this.getAlerts();
  }
  getAlerts() {
    api.getData("/users/" + this.userid + "/alerts").then(resp => {
      console.log(resp.data);
    });
  }

  render() {
    return (
      <>
        <div className="content">
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <form>
              <ModalHeader>Add New User</ModalHeader>
              <ModalBody />
              <ModalFooter />
            </form>
          </Modal>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Alerts and Notifications</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Agent ID</th>
                        <th>Type</th>
                        <th>Remarks</th>
                        <th>TimeStamp</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>{/* {this.state.all_users.map((prop, key) => {
                        return (
                          <tr>
                            <td>{prop.fullname}</td>
                            <td>{prop.email}</td>
                            <td>{prop.id}</td>
                            <td>{prop.superuser == true ? "Admin" : "Normal"}</td>
                            <td>
                              <div className="row">
                                <Link to={`/users/` + prop.id}>
                                  <i className="col nc-icon nc-button-play text-success" />
                                </Link>
                                <i className="col nc-icon nc-simple-remove text-danger deleteagent" onClick={() => this.handleDelete(prop, key)} />
                              </div>
                            </td>
                          </tr>
                        );
                      })} */}</tbody>
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

export default withAuth(AlertsPage);
