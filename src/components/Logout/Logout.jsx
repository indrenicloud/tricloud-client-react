import React from "react";
import AuthService from 'service/AuthService';
import withAuth from '../Login/withAuth';
const Auth = new AuthService();

class Logout extends React.Component {
  constructor(pros){
    super(pros);
    this.handleLogout();
  }

  handleLogout(){
    Auth.logout()
    this.props.history.replace('/login');
 }
 render(){
   return null;
 }

}

export default withAuth(Logout);
