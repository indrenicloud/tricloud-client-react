import Dashboard from "views/Dashboard/Dashboard.jsx";
import Agents from "views/Agents/Agents.jsx";
import Settings from "views/Settings/Settings.jsx";
import Logout from "../components/Logout/Logout";
import Users from "../views/Users/Users";

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
  // {
  //   path: "/settings",
  //   name: "Settings",
  //   icon: "nc-icon nc-settings-gear-65",
  //   component: Settings
  // },
  {
    path: "/users",
    name: "Users",
    icon: "nc-icon nc-single-02",
    component: Users
  },
  {
    path: "/logout",
    name: "Logout",
    icon: "nc-icon nc-caps-small",
    component: Logout
  },
  { redirect: true, path: "/", pathTo: "/agents", name: "Dashboard" }
];
export default dashRoutes;
