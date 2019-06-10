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
const api = new Api();

class AgentStats extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      all_stats: {}
    };
  }

  componentDidMount() {
    this.getStats();
  }

  getStats() {
    var url = "/api/agents/" + this.agentid + "/status/0/0";
    api.getData(url).then(result => {
      console.log("res", result);
      // this.setState({
      //   all_stats: result.data
      // });
    });
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={6} md={6} lg={8}>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h3 className={"card-title cpu_usage_title"}>CPU Stats</h3>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Line data={dashboardNASDAQChart.data} options={dashboardNASDAQChart.options} />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withAuth(AgentStats);
