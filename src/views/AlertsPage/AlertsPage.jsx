import React, { Component } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import { Link } from "react-router-dom";
import withAuth from "components/Login/withAuth";
import Api from "../../service/Api";

const api = new Api();
class AlertsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: []
    };
    this.userid = this.props.user.u;
    this.getAlerts = this.getAlerts.bind(this);
  }

  componentDidMount() {
    this.getAlerts();
  }
  getAlerts() {
    api.getData("/api/users/" + this.userid + "/alerts").then(resp => {
      const alerts = resp.data;
      console.log(alerts);
      var alerts_data = [];
      alerts.map(prop => {
        prop = JSON.parse(prop);
        alerts_data.push(prop);
      });
      this.setState({
        alerts: alerts_data
      });
    });
  }

  render() {
    return (
      <>
        <div className="content">
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <form>
              <ModalHeader />
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
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.alerts.map((prop, key) => {
                        return (
                          <tr>
                            <td>{prop.Agentid}</td>
                            <td>{prop.Events[0].Type}</td>
                            <td>{prop.Events[0].Message}</td>
                            <td>{prop.Timestamp}</td>
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

export default withAuth(AlertsPage);
