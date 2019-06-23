import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, Redirect } from "react-router-dom";

import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import AgentDetail from "views/AgentDetail/AgentDetail";
import AgentStats from "views/AgentStats/AgentStats";
import dashboardRoutes from "routes/dashboard.jsx";
import UserProfile from "../../views/UserProfile/UserProfile";
import { messaging } from "../../init-fcm";
import NotificationAlert from "react-notification-alert";

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info"
    };
    this.alert = this.alert.bind(this);
    this.notify = this.notify.bind(this);
  }

  alert(type, msg) {
    var options = {
      place: "tr",
      message: msg,
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  }
  notify(msg, ...type) {
    var type = type[0] || "success";

    var options = {
      place: "tr",
      message: msg,
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
    messaging
      .requestPermission()
      .then(async function() {
        const token = await messaging.getToken();
        console.log(token);
      })
      .catch(function(err) {
        console.log("Unable to get permission to notify.", err);
      });

    navigator.serviceWorker.addEventListener("message", message => {
      messaging.onMessage(payload => {
        console.log(payload);
        const body = JSON.parse(payload.notification.body);
        if ("url" in body) {
          const url = body.url;
          const active = body.active;
          const timestamp = body.Timestamp;
          const msg = (
            <div>
              <h6>Tricloud Web Monitor</h6>
              <div>
                <p>
                  <strong>Url:</strong> {url}
                  <br />
                  <strong>Status :</strong> {active ? "UP" : "DOWN"}
                  <br />
                  <strong>TimeStamp:</strong>
                  {timestamp}
                </p>
              </div>
            </div>
          );
          if (active !== true) {
            var msg_type = "danger";
          } else {
            var msg_type = "success";
          }
          this.alert(msg_type, msg);
        } else {
          const agentid = body.Agentid;

          const timestamp = body.Timestamp;
          const event = body.Events[0];
          const title = event.Type;
          const event_msg = event.Message;
          const msg = (
            <div>
              <h6>{title}</h6>
              <div>
                <p>
                  <strong>AgentID:</strong> {agentid}
                  <br />
                  <strong>Remarks :</strong> {event_msg}
                  <br />
                  <strong>TimeStamp:</strong>
                  {timestamp}
                </p>
              </div>
            </div>
          );

          var msg_type = "danger";
          this.alert(msg_type, msg);
        }
      });
    });
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.refs.mainPanel.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = color => {
    this.setState({ activeColor: color });
  };
  handleBgClick = color => {
    this.setState({ backgroundColor: color });
  };
  render() {
    return (
      <div className="wrapper">
        <NotificationAlert ref="notificationAlert" />;
        <Sidebar {...this.props} routes={dashboardRoutes} bgColor={this.state.backgroundColor} activeColor={this.state.activeColor} />
        <div className="main-panel" ref="mainPanel">
          <Header {...this.props} />
          <Switch>
            <Route path="/agents/:agentId/stats/" render={props => <AgentStats {...props} notify={this.notify} />} />

            <Route path="/agents/:agentId" render={props => <AgentDetail {...props} notify={this.notify} />} />
            <Route path="/users/:userId" render={props => <UserProfile {...props} notify={this.notify} />} />

            {dashboardRoutes.map((prop, key) => {
              if (prop.redirect) {
                return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
              }

              return <Route path={prop.path} render={props => <prop.component {...props} notify={this.notify} />} key={key} />;
            })}
          </Switch>

          <Footer fluid />
        </div>
      </div>
    );
  }
}

export default Dashboard;
