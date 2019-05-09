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

let titles = ["PID", "USER", "CPU", "MEM", "UpTime", "Command"];

export default class TaskManager extends Component {
  constructor(props) {
    super(props);
    this.setState({
      termdata: {}
    });
    this.dataloaded = false;
  }

  updateTerminal = data => {
    console.log(data);
    this.dataloaded = true;
    this.setState({
      termdata: data.Processes
    });
  };

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
            {this.state.termdata.map((item, key) => {
              return (
                <tr key={key}>
                  {titles.map((title, key) => {
                    if (key === titles.length - 1)
                      return (
                        <th key={key} className="text-right">
                          {item[title]}
                        </th>
                      );
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
