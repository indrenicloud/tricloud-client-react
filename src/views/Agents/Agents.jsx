import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";
import withAuth from "components/Login/withAuth";
import { thead } from "variables/agents";
import Api from "service/Api";
import "./Agents.css";
import NotificationAlert from "react-notification-alert";
import Agentpage from "views/Agentpage/Agentpage.jsx";

const api = new Api();
class Agents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agents: null,
      agentsinfo: [],
      agentsempty: true
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.notify = this.notify.bind(this);
  }

  componentDidMount() {
    this.getAgents();
  }
  componentDidUpdate() {
    this.getAgents();
  }

  getAgents() {
    api.getData("/api/agents").then(result => {
      let agentsinfos = [];
      if (result.data.length > 0) {
        result.data.map(function(key) {
          const info = {
            data: [
              key.id,
              key.systeminfo.os,
              key.systeminfo.hostname,
              key.owner,
              key.systeminfo.platform + " " + key.systeminfo.platformVersion,
              key.active ? "Active" : "Inactive"
            ]
          };
          agentsinfos.push(info);
        });
        this.setState({
          agentsinfo: agentsinfos,
          agentsempty: false
        });
      } else {
        this.setState({
          agentsinfo: [],
          agentsempty: true
        });
      }
    });
  }

  componentWillUnmount() {
    this.setState({
      agentsempty: true
    });
  }

  handleDelete(prop) {
    var agentID = prop.data[0];
    api.deleteData("/api/agents/" + agentID).then(result => {
      if (result.status === "ok") {
        console.log(result.status);
        this.notify("tr", "Successfully delete agent " + agentID);
        this.getAgents();
      }
    });
  }

  onDismiss() {}
  notify(place, msg) {
    var type = "success";
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{msg}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  }
  render() {
    let emptyinfo;
    if (this.state.agentsempty) {
      emptyinfo = (
        <div>
          <center>Agent not found</center>
        </div>
      );
    }
    let path = this.props.history.location.pathname;
    console.log(this.props);

    return (
      (path == "/agents" && (
        <div className="content">
          <NotificationAlert ref="notificationAlert" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">List of Agents</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        {thead.map((prop, key) => {
                          if (key === thead.length - 1)
                            return (
                              <th key={key} className="text-right">
                                {prop}
                              </th>
                            );
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.agentsinfo.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.data.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                            <td>
                              <div className="row">
                                <div className="col action">
                                  <i className="nc-icon nc-button-play text-success" />
                                </div>
                                <div className="col action">
                                  <i className="nc-icon nc-sound-wave text-warning" />
                                </div>
                                <div className="col action">
                                  <i
                                    className="nc-icon nc-simple-remove text-danger"
                                    onClick={() => this.handleDelete(prop)}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  {emptyinfo}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )) ||
      (path != "/agents" && (
        <div className="content">
          <Agentpage name={path} {...this.props} />
        </div>
      ))
    );
  }
}

export default withAuth(Agents);
