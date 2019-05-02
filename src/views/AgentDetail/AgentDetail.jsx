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
import UsageBar from 'components/UsageBar/UsageBar';
import Terminal from 'components/Terminal/Terminal';
const api = new Api();

class AgentDetail extends Component {
  constructor(props) {
    super(props);
    this.agentid = this.props.match.params.agentId;
    this.state = {
      agentinfo: {},
      systeminfo: {},
      realcpumem_usage:{},
      avgcpu_usage:0,
      realcpu_usage:null,
    };
    this.getAgentData = this.getAgentData.bind(this);
    this.webSocketRespone = this.webSocketRespone.bind(this);
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

  webSocketRespone(event) {
    console.log(event);
    let myReader = new FileReader();
    myReader.readAsArrayBuffer(event);
    myReader.addEventListener("loadend", (e) =>{
      this.cpumem_usage =  parsePacket(e.srcElement.result);
    })
    if(typeof(this.cpumem_usage)!=="object"){
      this.setState({
        realcpumem_usage:{},
      });
    }
    else{
    this.setState({
      realcpumem_usage:this.cpumem_usage,
    });
  }
  
  let avgcpu_usage;
  let realcpu_usage = Object.entries(this.state.realcpumem_usage).map(
    ([key, value]) => {
      if(key === "CPUPercent"){
        let totalcpu_usage = value.reduce((previous, current) => current += previous);
        avgcpu_usage  = Math.round(totalcpu_usage / value.length);
        
      return value.map((v,i)=>{
          return (
            <li>{Math.round(v)}%</li>
            )});
      }
    }
  );
  
  this.setState({
    avgcpu_usage:avgcpu_usage,
    realcpu_usage:realcpu_usage
  })

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
        if(key !== "CPUPercent"){
        return (
          <div>
            {key} : {value}
          </div>
        );
        }
      }
    );
    
    console.log(api.getToken());
    return (
      <div className="content">
        <Row>
        <Col xs={12} sm={6} md={6} lg={5}>
            <Card >
              <h1>CPU Usage</h1>
              <CardBody>
                <Row>
                  <Col id="realcpu_usage">
                  <UsageBar data={this.state.avgcpu_usage}/>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <ol>
                {this.state.realcpu_usage}
                </ol>
              </CardFooter>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={6} lg={4}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                  <UsageBar/>
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
                  <Col>
                    {agentinfo}                   
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
                  <Col>
                  {systeminfo}
                  </Col>
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
                  <Terminal />       
                  </Col>
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
          onMessage={this.webSocketRespone.bind(this) }
        />
      </div>
    );
  }
}

function parsePacket(arrbuf) {
  //let ubuff = new Uint8Array(data);
  let offset = arrbuf.byteLength - 4;
  let headerbuf = arrbuf.slice(offset, arrbuf.byteLength);
  let headerdataview = new DataView(headerbuf, 0);
  let connid = headerdataview.getUint8(0);
  let cmdtype = headerdataview.getUint8(2);
  let flow = headerdataview.getUint8(3);

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
 
  return (header, response);
}

function encodeMsg(msgstr, connid, cmdtype, flowtype) {
  let headUarr = new Uint8Array([connid, 0, cmdtype, flowtype]);
  let bodyUarray;
  if ("TextDecoder" in window) {
    let json = JSON.stringify(msgstr);
    let encoder = new TextEncoder();
    bodyUarray = encoder.encode(json);
  } else {
    console.log("OLD Browser");
  }
  let combined = new Uint8Array([...bodyUarray, ...headUarr]);

  return combined.buffer;
}

export default AgentDetail;
