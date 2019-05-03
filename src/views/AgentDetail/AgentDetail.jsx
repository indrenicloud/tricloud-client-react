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
import { Link, Route } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import Websocket from "react-websocket";
import { number } from "prop-types";

import UsageBar from "components/UsageBar/UsageBar";
import Terminal from "components/Terminal/Terminal";
import Stats from "components/Stats/Stats.jsx";
import withAuth from "components/Login/withAuth";
import { thead } from "variables/agents";
import Api from "service/Api";
import {
  parsePacket,
  encodeMsg,
  CMD_SYSTEM_STAT,
  CMD_TERMINAL
} from "../../service/utility";

const api = new Api();

class AgentDetail extends Component {
  constructor(props) {
    super(props);
    this.agentid = this.props.match.params.agentId;
    this.state = {
      agentinfo: {},
      systeminfo: {},
      realcpumem_usage: {},
      avgcpu_usage: 0,
      realcpu_usage: null
    };
    this.getAgentData = this.getAgentData.bind(this);
    this.webSocketResponse = this.webSocketResponse.bind(this);
    this.terminalToWs = this.terminalToWs.bind(this);
    this.ProcessTerminal = this.ProcessTerminal.bind(this);
    this.ProcessSystemStat = this.ProcessSystemStat.bind(this);
    this.terminalRef = React.createRef();
    this.websocketRef = React.createRef();
    this.cpumem_usage = {};
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

  webSocketResponse(event) {
    console.log(event);
    let myReader = new FileReader();
    myReader.readAsArrayBuffer(event);
    myReader.addEventListener("loadend", e => {
      let [head, body] = parsePacket(e.srcElement.result);
      console.log(head, body);
      switch (head.cmdtype) {
        case CMD_SYSTEM_STAT:
          this.ProcessSystemStat(head, body);
          break;
        case CMD_TERMINAL:
          this.ProcessTerminal(head, body);
          break;
        default:
          console.log("Not implemented");
          break;
      }
    });
  }

  ProcessTerminal(header, body) {
    this.terminalRef.current.outputFromAgent(body);
  }

  ProcessSystemStat(respHead, respBody) {
    this.cpumem_usage = respBody;
    if (typeof this.cpumem_usage !== "object") {
      this.setState({
        realcpumem_usage: {}
      });
    } else {
      this.setState({
        realcpumem_usage: this.cpumem_usage
      });
    }

    let avgcpu_usage;
    let realcpu_usage = Object.entries(this.state.realcpumem_usage).map(
      ([key, value]) => {
        if (key === "CPUPercent") {
          let totalcpu_usage = value.reduce(
            (previous, current) => (current += previous)
          );
          avgcpu_usage = Math.round(totalcpu_usage / value.length);

          return value.map((v, i) => {
            return <li>{Math.round(v)}%</li>;
          });
        }
      }
    );

    this.setState({
      avgcpu_usage: avgcpu_usage,
      realcpu_usage: realcpu_usage
    });
  }

  terminalToWs(data) {}

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

    var realmem_usage = Object.entries(this.state.realcpumem_usage).map(
      ([key, value]) => {
        if (key !== "CPUPercent") {
          return (
            <div>
              {key} : {value}
            </div>
          );
        }
      }
    );

    //console.log(api.getToken());
    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={6} md={6} lg={5}>
            <Card>
              <h1>CPU Usage</h1>
              <CardBody>
                <Row>
                  <Col id="realcpu_usage">
                    <UsageBar data={this.state.avgcpu_usage} />
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <ol>{this.state.realcpu_usage}</ol>
              </CardFooter>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <UsageBar />
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                {realmem_usage}
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardBody>
                <Row>
                  <Col>{agentinfo}</Col>
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
                  <Col>{systeminfo}</Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <Terminal
                      ref={this.terminalRef}
                      sendtows={this.terminalToWs}
                    />
                  </Col>
                </Row>
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>

        <Websocket
          url={"ws://localhost:8080/websocket/" + api.getToken()}
          onMessage={this.webSocketResponse.bind(this)}
        />
      </div>
    );
  }
}

export default AgentDetail;
