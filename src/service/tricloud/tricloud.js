import { Print, ParseHeader } from "./utility";
//import * as callback from "./const";
import React, { Component } from "react";

const WsContext = React.createContext();

class WsProvider extends Component {
  state = {
    connected: false
  };

  constructor() {
    this.ws = null;
    this.Receivers = {};
    this.receive = this.receive.bind(this);
    this.RegisterReceiver = this.RegisterReceiver.bind(this);
    this.Send = this.Send.bind(this);
    this.SendAgent = this.SendAgent.bind(this);
  }

  componentDidMount() {
    this.ws = new WebSocket("ws://localhost:8080/websocket");
    this.ws.onopen = event => {
      Print("open" + event.data);
    };

    this.ws.onclose = event => {
      Print("CLOSE" + event.data);
      ws = null;
    };
    this.ws.onerror = event => {
      Print("ERROR: " + event.data);
    };

    this.ws.onmessage = this.receive;
  }
  receive(data) {
    Print("RECEIVE:" + data);
    //header = ParseHeader(data);
    //callback = this.Receivers[header.msgtype];
    //callback(data[header.offset]);
  }

  RegisterReceiver(key, callback) {
    this.Receivers[key] = callback;
  }

  UnregisterReceiver(key) {
    delete this.Receivers[key];
  }

  Send(msgtype, msg) {}

  SendToAgent(msgtype, agentid, msg) {}

  render() {
    return (
      <WsContext.Provider
        value={{
          state: this.state,
          Register: this.RegisterReceiver,
          Unregister: this.UnregisterReceiver,
          send: this.Send,
          sendtoagent: this.SendAgent
        }}
      >
        {this.props.children}
      </WsContext.Provider>
    );
  }
}
export default WsProvider;
