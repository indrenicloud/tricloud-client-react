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

  webSocketRespone(event) {
    console.log(event);
    console.log(typeof event);
    let myReader = new FileReader();
    myReader.readAsArrayBuffer(event);

    myReader.addEventListener("loadend", function(e) {
      parsePacket(e.srcElement.result);
    });
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

function parsePacket(arrbuf) {
  //let ubuff = new Uint8Array(data);
  console.log(arrbuf);
  let offset = arrbuf.byteLength - 4;
  let headerbuf = arrbuf.slice(offset, arrbuf.byteLength);
  let headerdataview = new DataView(headerbuf, 0);
  let connid = headerdataview.getUint8(0);
  let flow = headerdataview.getUint8(2);
  let cmdtype = headerdataview.getUint8(3);

  //string/json
  var response;
  let bodybuff = arrbuf.slice(0, offset);
  let bodydataview = new DataView(bodybuff);

  if ("TextDecoder" in window) {
    var decoder = new TextDecoder("utf-8");
    response = JSON.parse(decoder.decode(bodydataview));
  } else {
    console.log("OLD BROWSER");
    let decodedString = String.fromCharCode.apply(
      null,
      new Uint8Array(bodybuff)
    );
    response = JSON.parse(decodedString);
  }
  let header = {
    connid: connid,
    flow: flow,
    cmdtype: cmdtype
  };
  console.log(header);
  console.log(response);
  return header, response;
}

export default AgentDetail;
