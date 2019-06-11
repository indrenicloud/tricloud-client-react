import React, { Component } from "react";
import { Card, CardBody, CardHeader, CardTitle, Table, Row, Col, CardFooter } from "reactstrap";
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
import "./AgentDetail.css";
import Moment from "react-moment";
import "moment-timezone";
import MemDonut from "components/MemDonut/MemDonut";
import { parsePacket, encodeMsg, CMD_AGENTSBROADCAST, CMD_SYSTEM_STAT, CMD_TERMINAL, CMD_TASKMGR, formatBytes } from "../../service/utility";
import TaskManager from "../../components/TaskManager/TaskManager";

const api = new Api();

class AgentDetail extends Component {
  constructor(props) {
    super(props);
    this.agentid = this.props.match.params.agentId;
    this.connid = 0;
    this.state = {
      agentinfo: {},
      systeminfo: {},
      realcpumem_usage: {},
      avgcpu_usage: 0,
      allcpu_usage: [],
      memusage: [{ inits: "Free", value: 50 }, { inits: "Used", value: 50 }],
      netusage: {},
      stat_timestamp: 0,
      netspeed: {}
    };
    this.getAgentData = this.getAgentData.bind(this);
    this.webSocketResponse = this.webSocketResponse.bind(this);
    this.terminalToWs = this.terminalToWs.bind(this);
    this.ProcessTerminal = this.ProcessTerminal.bind(this);
    this.ProcessSystemStat = this.ProcessSystemStat.bind(this);
    this.startTerminal = this.startTerminal.bind(this);
    this.ProcessAgentsBroadcast = this.ProcessAgentsBroadcast.bind(this);
    this.terminalRef = React.createRef();
    this.websocketRef = React.createRef();
    this.taskmanagerRef = React.createRef();
    this.sys_usage = {};
    this.head = {};
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
      this.head = head;
      console.log(head, body);

      if (head.cmdtype == CMD_AGENTSBROADCAST) {
        this.ProcessAgentsBroadcast(head, body);
        return;
      }
      if (this.connid != head.connid) {
        console.log("DROPPING PACKET");
        return;
      }

      switch (head.cmdtype) {
        case CMD_SYSTEM_STAT:
          this.ProcessSystemStat(head, body);
          break;
        case CMD_TERMINAL:
          this.ProcessTerminal(head, body);
          break;
        case CMD_TASKMGR:
          let _func = this.taskmanagerRef.current.updateTerminal;
          if (_func != null) {
            _func(body);
          }
          break;
        default:
          console.log("Not implemented");
          break;
      }
    });
  }
  ProcessAgentsBroadcast(head, body) {
    if (this.agentid in body["Agents"]) {
      this.connid = body["Agents"][this.agentid];
    } else {
      // TODO handle agent is offline
    }
  }

  ProcessTerminal(header, body) {
    console.log("VERY NEAR", body);
    this.terminalRef.current.outputFromAgent(body.Data);
  }

  ProcessSystemStat(respHead, respBody) {
    this.sys_usage = respBody;
    let stat_timestamp = this.sys_usage["TimeStamp"];
    let cpu_cores = this.sys_usage["CPUPercent"];
    let totalcpu_usage = cpu_cores.reduce((previous, current) => (current += previous));
    let avgcpu_usage = Math.round(totalcpu_usage / cpu_cores.length);
    let allcpu_usage = cpu_cores;

    let total_mem = this.sys_usage["TotalMem"];
    let free_mem = this.sys_usage["AvailableMem"];

    let mem_usage = [{ inits: "Free", value: 1 }, { inits: "Used", value: 99 }];

    if (total_mem && free_mem) {
      mem_usage = [{ inits: "Free", value: free_mem }, { inits: "Used", value: total_mem - free_mem }];
    }

    let new_sentbytes = this.sys_usage["NetSentbytes"];
    let new_recvbytes = this.sys_usage["NetRecvbytes"];

    let sentbytes_diff = new_sentbytes - this.state.netusage["sentbytes"];
    let recvbytes_diff = new_recvbytes - this.state.netusage["recvbytes"];

    let new_datetime = new Date(stat_timestamp / 1000000);
    let old_datetime = new Date(this.state.stat_timestamp / 1000000);
    let stat_timestamp_diff = new_datetime - old_datetime;

    console.log(sentbytes_diff, "---", stat_timestamp_diff);
    let time_diff = stat_timestamp_diff / 1000;
    let netusage = {
      sentbytes: new_sentbytes,
      recvbytes: new_recvbytes
    };

    let netspeed = {
      up: sentbytes_diff / time_diff,
      down: recvbytes_diff / time_diff
    };
    this.setState({
      avgcpu_usage: avgcpu_usage,
      allcpu_usage: allcpu_usage,
      memusage: mem_usage,
      netusage: netusage,
      netspeed: netspeed,
      stat_timestamp: stat_timestamp
    });
  }

  startTerminal() {
    let out = encodeMsg({ Data: "" }, this.head.connid, CMD_TERMINAL, 1);
    this.websocketRef.current.sendMessage(out);
  }

  terminalToWs(data) {
    let out = encodeMsg({ Data: data }, this.head.connid, CMD_TERMINAL, 1);
    this.websocketRef.current.sendMessage(out);
  }

  render() {
    var agentinfo = Object.entries(this.state.agentinfo).map(([key, value]) => {
      if (key === "firstadded" || key === "lastlogin") {
        return (
          <div>
            {key} :{" "}
            <Moment tz="Asia/Kathmandu" format="YYYY-MMM-DD HH:mm:ss">
              {value}
            </Moment>
            , <Moment fromNow>{value}</Moment>
          </div>
        );
      }
      return (
        <div>
          {key} : {value.toString()}
        </div>
      );
    });
    var systeminfo = Object.entries(this.state.systeminfo).map(([key, value]) => {
      if (value.length > 0) {
        return (
          <div>
            {key} : {value.toString()}
          </div>
        );
      }
    });

    // let total_mem = this.sys_usage["TotalMem"];
    // let free_mem = this.sys_usage["AvailableMem"];
    // let mem_usage = [
    //   { inits: 'Free', value: 0 },
    //   { inits: 'Used', value: 0 }
    // ]
    // if (total_mem && free_mem) {
    //   mem_usage = [
    //     { inits: 'Free', value: free_mem },
    //     { inits: 'Used', value: total_mem - free_mem }
    //   ]

    // }

    //console.log(api.getToken());
    //dashboard-level
    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h3 className={"card-title cpu_usage_title"}>CPU Usage</h3>
                    <div id="cpu_usagebar">
                      <UsageBar data={this.state.avgcpu_usage} />
                    </div>
                  </Col>
                </Row>
                <div className="stats">
                  <span>Total CPU Cores : {this.state.allcpu_usage.length}</span>
                  <ul id="allcpu_usage" className={"allcpu_usage"}>
                    {Object.keys(this.state.allcpu_usage).map(key => {
                      return <li>{Math.round(this.state.allcpu_usage[key])}% </li>;
                    })}
                  </ul>
                </div>
              </CardBody>
              <CardFooter>
                <Row>
                  <Col>
                    <h3 className="avgcpu_stats center">{this.state.avgcpu_usage}% </h3>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h3 className={"card-title mem_usage_title"}>Memory Usage</h3>
                    <div id="mem_usagebar">
                      <MemDonut className="memory-donut" memory={this.state.memusage} />
                    </div>
                  </Col>
                </Row>
                {/* <div className="stats">
                  
                </div> */}
              </CardBody>
              {/* <CardFooter>
              </CardFooter> */}
            </Card>
          </Col>

          <Col xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardBody>
                <h3 className={"card-title net_usage_title"}>Network Usage</h3>
                <Row>
                  <Col>
                    <div className="netspeed_stats center">
                      <i className="nc-icon nc-minimal-up" />
                      {formatBytes(this.state.netspeed["up"], true)}/s
                    </div>
                  </Col>
                  <Col>
                    <div className="netspeed_stats center">
                      <i className="nc-icon nc-minimal-down" /> {formatBytes(this.state.netspeed["down"], true)}/s
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Row>
                  <Col>
                    <div className="netusage_stats center">{formatBytes(this.state.netusage["sentbytes"], true)}</div>
                  </Col>
                  <Col>
                    <div className="netusage_stats center">{formatBytes(this.state.netusage["recvbytes"], true)} </div>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h3 className={"card-title agent_info_title"}>Agent Info</h3>
                    <div id="agentinfo">{agentinfo}</div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h3 className={"card-title system_info_title"}>System Details</h3>
                    <div id="system_details">{systeminfo}</div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>
        {/* <input
          type="button"
          onClick={this.startTerminal}
          name="Terminal start"
        /> */}
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h3 className={"card-title "}>Terminal</h3>
                    <Terminal ref={this.terminalRef} sendtows={this.terminalToWs} />
                  </Col>
                </Row>
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h3 className={"card-title "}>Task Manager</h3>
                    <TaskManager ref={this.taskmanagerRef} />
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <button
                  onClick={event => {
                    console.log(event);
                    let out = encodeMsg({ Interval: 5, Timeout: 200 }, this.head.connid, CMD_TASKMGR, 1);
                    this.websocketRef.current.sendMessage(out);
                  }}
                >
                  Show Processes
                </button>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Websocket url={"ws://" + process.env.REACT_APP_API_URL + "/websocket/" + api.getToken()} ref={this.websocketRef} onMessage={this.webSocketResponse.bind(this)} />
      </div>
    );
  }
}

export default AgentDetail;
