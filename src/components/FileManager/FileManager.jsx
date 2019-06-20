import React, { Component, createRef } from "react";
//import streamSaver from 'StreamSaver'
import FmHead from "./subcom/FmHead";
import FmBody from "./subcom/FmBody";
import { downloadStream } from "service/utility";
import { Modal, ModalBody, ModalHeader, ModalFooter, Navbar } from "reactstrap";
import "./FileManager.css";

import { CMD_FM_ACTION, CMD_FM_LISTDIR, CMD_START_SERVICE, CMD_DOWNLOAD_SERVICE } from "../../service/utility";
const streamSaver = require("streamsaver");

export default class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileslist: [{ Name: ".", Type: ".", Size: "." }]
    };
    this.dataloaded = false;
    this.inData = this.inData.bind(this);
    this.listDir = this.listDir.bind(this);
    this.back = this.back.bind(this);
    this.doAction = this.doAction.bind(this);
    this.actionDone = this.actionDone.bind(this);
    this.refresh = this.refresh.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.FmBodyRef = createRef();
    //this.fileStream = null;
    this.swriter = null;
    this.Path = ".";
    this.ParentPath = "";
    this.pendingRename = {};
    this.newRename_name = "";
    this.tcount = 0;
  }

  inData(data) {
    this.dataloaded = true;
    this.Path = data.Path;
    this.ParentPath = data.ParentPath;
    let files = data.FSNodes;
    if (files == null) {
      files = [];
    }

    this.setState({
      fileslist: files,
      showRename: false
    });
  }

  componentDidUpdate() {
    if (!this.dataloaded) {
      this.refresh();
    }
  }

  actionDone(head, body) {
    console.log(body);
    if (head.cmdtype == CMD_DOWNLOAD_SERVICE){
      if(!this.swriter) {
         this.fileStream = streamSaver.createWriteStream("haha", {});
        if (this.fileStream.locked){
          console.log("LOCKED")
          return
        }
        this.swriter = this.fileStream.getWriter();
      }
      if(this.tcount > 3){
        if(this.swriter.closed) {
          return
        }
        this.swriter.close()
        return
      }
      this.tcount++;

      this.swriter.write(body)
    }

    this.refresh();
  }

  refresh() {
    this.props.SendToWs({ Path: this.Path }, CMD_FM_LISTDIR);
  }

  listDir(dname) {
    let path = this.Path + "/" + dname;
    this.props.SendToWs({ Path: path }, CMD_FM_LISTDIR);
  }
  back() {
    this.props.SendToWs({ Path: this.ParentPath }, CMD_FM_LISTDIR);
  }

  doAction(actionName) {
    console.log("ACTIONFIRED", actionName);
    let selected = this.FmBodyRef.current.getSelections();
    let out = {};
    switch (actionName) {
      case "mkdir":
        //pass
        break;
      case "rename":
        if (selected.length > 1) {
          console.log("cannot rename multiple element at once");
          return;
        }

        this.pendingRename = {
          Action: actionName,
          Basepath: this.Path,
          Targets: selected
        };
        this.setState({ showRename: true });
        break;
      case "back":
        this.props.SendToWs({ Path: this.ParentPath }, CMD_FM_LISTDIR);
        break;
      case "delete":
        out = {
          Action: actionName,
          Basepath: this.Path,
          Targets: selected
        };
        this.props.SendToWs(out, CMD_FM_ACTION);
        break;
      case "download":
        this.downloadFile(selected);
        break;
      default:
        break;
    }
  }

  /* Action methods */
  downloadFile(selected) {
    if (selected.length > 1) {
      console.log("multiple file selected, supports only one");
      return;
    }
    let fPath = this.Path + "/" + selected[0];
    //this.fileStream = streamSaver.createWriteStream(selected[0], {});

    this.props.SendToWs({ Options: [fPath], ServiceType: CMD_DOWNLOAD_SERVICE }, CMD_START_SERVICE);
  }

  render() {
    return (
      this.dataloaded && (
        <div>
          <Navbar className="fm-nav">
            <FmHead path={this.Path} doaction={this.doAction} />
          </Navbar>
          <Modal
            isOpen={this.state.showRename}
            toggle={() => {
              this.setState(prevState => ({
                showRename: !prevState.showRename
              }));
            }}
          >
            <ModalHeader>Rename</ModalHeader>
            <ModalBody>
              <input
                onInput={e => {
                  this.newRename_name = e.target.value;
                }}
              />
            </ModalBody>

            <ModalFooter>
              <button
                onClick={() => {
                  this.setState(prevState => ({
                    showRename: !prevState.showRename
                  }));
                  this.pendingRename.Destination = this.newRename_name;
                  this.props.SendToWs(this.pendingRename, 12);
                }}
              >
                Rename
              </button>
            </ModalFooter>
          </Modal>
          <FmBody files={this.state.fileslist} listDir={this.listDir} path={this.Path} ref={this.FmBodyRef} />
        </div>
      ));
  }
}
