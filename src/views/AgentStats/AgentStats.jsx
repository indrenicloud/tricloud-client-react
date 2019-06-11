import React, { Component } from "react";
import { Card, CardBody, CardHeader, CardTitle, Table, Row, Col, CardFooter } from "reactstrap";
import { Link, Route } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import Websocket from "react-websocket";
import { number } from "prop-types";
import Stats from "components/Stats/Stats.jsx";
import withAuth from "components/Login/withAuth";
import { thead } from "variables/agents";
import Api from "service/Api";
import Moment from "react-moment";
import "moment-timezone";
import { Line, Pie } from "react-chartjs-2";
import { dashboardNASDAQChart } from "variables/charts.jsx";
import { formatBytes } from "../../service/utility";
const api = new Api();

class AgentStats extends Component {
  constructor(props) {
    super(props);
    this.agentid = this.props.match.params.agentId;
    this.state = {
      all_stats: {},
      mem_data: []
    };
  }

  componentDidMount() {
    this.getStats();
  }

  getStats() {
    var url = "/api/agents/" + this.agentid + "/status";
    console.log(url);
    var data = {
      noofentries: 0,
      offset: 0
    };
    api.postData(url, data).then(result => {
      var mem_stats = [];
      var time_stamp = [];
      Object.entries(result.data).map(([key, value]) => {
        console.log(value);
        mem_stats.push(formatBytes(value.TotalMem - value.AvailableMem));
        time_stamp.push(new Date(value.TimeStamp / 1000000).toDateString());
      });
      this.setState({
        all_stats: result.data,
        mem_data: {
          mem_stats: mem_stats,
          time_stamp: time_stamp
        }
      });
    });
  }

  render() {
    var MemChart = {
      data: {
        labels: this.state.mem_data.time_stamp,
        datasets: [
          {
            label: "Memory Used",
            data: this.state.mem_data.mem_stats,
            fill: false,
            borderColor: "#fbc658",
            backgroundColor: "transparent",
            pointBorderColor: "#fbc658",
            pointRadius: 4,
            pointHoverRadius: 4,
            pointBorderWidth: 8
          }
        ]
      },
      options: {
        legend: {
          display: true,
          position: "bottom"
        }
      }
    };

    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={6} md={6} lg={8}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h3 className={"card-title cpu_usage_title"}>Memory Graph</h3>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Line data={MemChart.data} options={MemChart.options} />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withAuth(AgentStats);
