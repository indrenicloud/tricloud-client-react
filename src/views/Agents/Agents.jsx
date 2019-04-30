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
import { Link, Route } from "react-router-dom";
import NotificationAlert from "react-notification-alert";

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
    this.getAgents = this.getAgents.bind(this);
  }

  componentDidMount() {
    this.getAgents();
  }
  componentDidUpdate() {
    // this.getAgents();
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
      agentsinfo: [],
      agentsempty: true
    });
  }

  handleDelete(prop, key) {
    var agentID = prop.data[0];
    api.deleteData("/api/agents/" + agentID).then(result => {
      if (result.status === "ok") {
        console.log(result.status);
        this.notify("tr", "Successfully delete agent " + agentID);
      }
      var agentsinfo = this.state.agentsinfo;
      delete agentsinfo[key];
      this.setState({
        agentsinfo: agentsinfo
      });
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
      return (
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
                                  <Link to={`/agents/` + prop.data[0]}>
                                    <i className="nc-icon nc-button-play text-success" />
                                  </Link>
                                </div>
                                <div className="col action">
                                  <i className="nc-icon nc-sound-wave text-warning" />
                                </div>
                                <div className="col action">
                                  <i
                                    className="nc-icon nc-simple-remove text-danger"
                                    onClick={() => this.handleDelete(prop, key)}
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
      );
    }
  
}

export default withAuth(Agents);
