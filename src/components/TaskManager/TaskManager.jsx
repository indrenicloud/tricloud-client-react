import React, { Component, Fragment } from "react";
import { Card, CardBody, CardHeader, CardTitle, Table, Row, Col } from "reactstrap";
import "./TaskManager.css";
let titles = ["PID", "USER", "CPU", "MEM", "UpTime", "Command"];

export default class TaskManager extends Component {
  constructor(props) {
    super(props);
    this.setState({
      termdata: {}
    });
    this.dataloaded = false;
    this.killProcess = this.killProcess.bind(this);
  }

  getFilteredProcesses = () =>
    this.state.termdata.filter(element => {
      if (element["UpTime"] == 0 || element["MEM"] == 0) return false;
      else return true;
    });

  updateTerminal = data => {
    console.log(data);
    this.dataloaded = true;
    this.setState({
      termdata: data.Processes
    });
  };

  killProcess(key) {
    this.props.sendtoTaskmgr(key, "kill");
  }

  render() {
    return (
      this.dataloaded && (
        <Table responsive>
          <thead className="text-primary">
            <tr>
              {titles.map((title, key) => {
                if (key === titles.length - 1)
                  return (
                    <th key={key} className="text-right">
                      {title}
                    </th>
                  );
                return <th key={key}>{title}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.getFilteredProcesses().map((item, key) => {
              return (
                <tr key={key}>
                  {titles.map((title, key) => {
                    if (key === titles.length - 1)
                      return (
                        <Fragment>
                          <th key={key} className="text-right">
                            {item[title]}
                          </th>
                          <th>
                            <button onClick={() => this.killProcess(item["PID"])}>Kill</button>
                          </th>
                        </Fragment>
                      );

                    if (key === 2) {
                      item[title] = Number(item[title]).toFixed(4);
                    }
                    return <th key={key}>{item[title]}</th>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )
    );
  }
}
