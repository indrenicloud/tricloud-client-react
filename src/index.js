import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import {  Router, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss";
import "assets/demo/demo.css";
import Login from "components/Login/Login.jsx";
import Dashboard from "layouts/Dashboard/Dashboard.jsx";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function(registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function(err) {
      console.log("Service worker registration failed, error:", err);


    });
}

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
     <Route exact path="/login" name="Login" component={Login}></Route>
     <Route path="/" name="Dashboard" component={Dashboard}></Route>
     
    </Switch>
  </Router>,
  document.getElementById("root")
);
