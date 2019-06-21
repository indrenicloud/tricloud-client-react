import React, { Component, Fragment } from "react";
const streamSaver = require("streamsaver");
streamSaver.WritableStream = require("web-streams-polyfill/ponyfill").WritableStream;

export default class Download extends Component {
  constructor(props) {
    super(props);
    this.blockIn = this.blockIn.bind(this);
    this.initNewDownload = this.initNewDownload.bind(this);
    this.isRunning = this.isRunning.bind(this);
    this.timerFunc = this.timerFunc.bind(this);
    this.dlrunning = false;
    this.swriter = null;
    this.pendingBlocks = [];
    this.finished = false;
  }
  isRunning() {
    return this.dlrunning;
  }

  initNewDownload(filename) {
    if (this.dlrunning) {
      return;
    }
    let fileStream = streamSaver.createWriteStream(filename);
    console.log(fileStream);
    this.swriter = fileStream.getWriter();

    this.timer = setInterval(this.timerFunc, 3000);
  }
  blockIn(head, block) {
    const next = async () => {
      if (this.pendingBlocks.length == 0) {
        //console.log("return next");
        this.dlrunning = false;
        return;
      }
      this.dlrunning = true;
      // console.log("About pop champane!");

      let currBlock = this.pendingBlocks.pop();
      var uint8View = new Uint8Array(currBlock);
      await this.swriter.write(uint8View).then(() => {
        console.log("next");
        next();
      });
    };
    this.pendingBlocks.push(block);

    //console.log(head);
    if (head.ehead.Finished) {
      //console.log("_____________FINISHED___________")
      this.finished = true;
    }

    if (this.dlrunning) {
      return;
    }
    next();
  }
  timerFunc() {
    //console.log("timer called");
    //console.log(this.pendingBlocks );
    //console.log((this.pendingBlocks.length == 0) );
    //console.log(this.finished);
    //console.log((!this.dlrunning));

    if (!this.dlrunning && this.pendingBlocks.length == 0 && this.finished) {
      console.log("closing for real");
      this.swriter.close();
      clearInterval(this.timer);
    }
  }

  render() {
    return <div>{"Download"}</div>;
  }
}
