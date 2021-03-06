import React, { Component } from "react";
import AuthService from "service/AuthService";

export default function withAuth(AuthComponent) {
  const Auth = new AuthService("http://localhost:8080");
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        user: null
      };
    }
    componentDidMount() {
      if (!Auth.loggedIn()) {
        this.props.history.replace("/login");
      } else {
        try {
          const profile = Auth.getProfile();
          this.setState({
            user: profile
          });
          console.log("logged int");
        } catch (err) {
          Auth.logout();
          this.props.history.replace("/login");
        }
      }
    }

    render() {
      if (this.state.user) {
        return <AuthComponent history={this.props.history} user={this.state.user} match={this.props.match} notify={this.props.notify} />;
      } else {
        return null;
      }
    }
  };
}
