import Dashboard from "views/Dashboard/Dashboard.jsx";
import Agents from "views/Agents/Agents.jsx";
import Settings from "views/Settings/Settings.jsx";
import Logout from "../components/Logout/Logout";
import Users from "../views/Users/Users";
import AlertsPage from "../views/AlertsPage/AlertsPage";
import Automation from "../views/Automation/Automation";
import WebMonitor from "../views/WebMonitor/WebMonitor";

var dashRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "nc-icon nc-bank",
  //   component: Dashboard
  // },
  {
    path: "/agents",
    name: "Agents",
    icon: "nc-icon nc-app",
    component: Agents
  },

  {
    path: "/alerts",
    name: "Alerts",
    icon: "nc-icon nc-alert-circle-i",
    component: AlertsPage
  },
  {
    path: "/web-monitor",
    name: "Web Monitoring",
    icon: "nc-icon nc-world-2",
    component: WebMonitor
  },
  {
    path: "/automation",
    name: "Automation",
    icon: "nc-icon nc-spaceship",
    component: Automation
  },
  {
    path: "/users",
    name: "Users",
    icon: "nc-icon nc-single-02",
    component: Users
  },
  {
    pro: true,
    path: "/logout",
    name: "Logout",
    icon: "nc-icon nc-minimal-left",
    component: Logout
  },
  { redirect: true, path: "/", pathTo: "/agents", name: "Dashboard" }
];
export default dashRoutes;
