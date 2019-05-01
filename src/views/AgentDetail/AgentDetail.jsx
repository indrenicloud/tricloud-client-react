import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
  CardFooter
} from "reactstrap";
import Websocket from "react-websocket";
import Stats from "components/Stats/Stats.jsx";

import withAuth from "components/Login/withAuth";
import { thead } from "variables/agents";
import Api from "service/Api";
import { Link, Route } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import { number } from "prop-types";
const api = new Api();

class AgentDetail extends Component {
  constructor(props) {
    super(props);
    this.agentid = this.props.match.params.agentId;
    this.state = {
      agentinfo: {},
      systeminfo: {}
    };
    this.getAgentData = this.getAgentData.bind(this);
  }

  componentDidMount() {
    this.getAgentData();
  }

  getAgentData() {
    api.getData("/api/agents/" + this.agentid).then(result => {
      const systeminfo = result.data["systeminfo"];
      delete result.data["systeminfo"];
      this.setState({
        agentinfo: result.data,
        systeminfo: systeminfo
      });
    });
  }

  webSocketRespone(data) {
    let decoded_data = decodeURIComponent(encodeURIComponent(data).replace("%03%00%01%02", ""));
    console.log(JSON.parse(decoded_data));
    console.log(typeof decoded_data);
  }

  render() {
    var agentinfo = Object.entries(this.state.agentinfo).map(([key, value]) => {
      return (
        <div>
          {key} : {value}
        </div>
      );
    });
    var systeminfo = Object.entries(this.state.systeminfo).map(
      ([key, value]) => {
        return (
          <div>
            {key} : {value}
          </div>
        );
      }
    );
    console.log(api.getToken());
    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    {agentinfo}
                    <hr />
                    {systeminfo}
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardBody>
                <Row>
                  <Col />
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Websocket
          url={"ws://localhost:8080/websocket/" + api.getToken()}
          onMessage={this.webSocketRespone.bind(this)}
        />
      </div>
    );
  }
}

export default AgentDetail;
