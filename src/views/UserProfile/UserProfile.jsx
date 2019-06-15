import React, { Component } from "react";

// reactstrap components
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup, Form, Input, Row, Col } from "reactstrap";
import Agents from "../Agents/Agents";
import Api from "service/Api";
import withAuth from "components/Login/withAuth";
import Avatar from "react-avatar";
import "./UserProfile.css";

const api = new Api();
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.userid = this.props.match.params.userId;
    this.state = {
      currentuser: {},
      apikeys: [],
      edituser: {}
    };
    this.getUserDetail = this.getUserDetail.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.editProfile = this.editProfile.bind(this);
  }

  componentDidMount() {
    this.getUserDetail();
  }

  getUserDetail() {
    api.getData("/api/users/" + this.userid).then(resp => {
      const currentuser = resp.data;
      this.setState({
        currentuser: currentuser,
        apikeys: currentuser.apikey
      });
    });
  }

  handleDelete(apikey) {
    api.deleteData("/api/user/api/" + apikey).then(resp => {
      console.log(resp);
      this.getUserDetail();
    });
  }

  addApiKey() {
    if (this.props.user.u === this.state.currentuser.id) {
      api.postData("/api/user/api", {}).then(resp => {
        console.log(resp);

        this.getUserDetail();
      });
    } else {
      alert("Adding API key is not permitted");
    }
  }
  onChange(e) {
    const { edituser } = { ...this.state };
    const currentState = edituser;
    const { name, value } = e.target;
    currentState[name] = value;
    this.setState({ edituser: currentState });
  }

  editProfile(e) {
    const { edituser } = { ...this.state };
    if (edituser.password !== edituser.confirmpassword) {
      alert("Password mismatch");
    } else {
      const data = edituser;
      api.putData("/api/users/" + this.userid, data).then(resp => {
        console.log(resp);
        if (resp.status != "failed") {
          // this.setState({
          //   currentuser: resp.data
          // });
        } else {
          alert("Failed to edit the profile");
        }
      });
    }
    e.preventDefault();
  }
  render() {
    if (this.state.apikeys != null) {
      var apikeys = this.state.apikeys.map((key, index) => {
        return (
          <li className="blockquote blockquote-primary" for={index}>
            <p>{key}</p>

            <i className="nc-icon nc-simple-remove text-danger deleteapikey" onClick={() => this.handleDelete(key)} />
          </li>
        );
      });
    } else {
      var apikeys = <li className=" blockquote blockquote-primary text-center">Api key not found! Please create one.</li>;
    }

    return (
      <>
        <div className="content">
          <Row>
            <Col md="6">
              <Card className="card-user">
                <div className="image" />
                <CardBody>
                  <div className="author">
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <Avatar email={this.state.currentuser.email} name={this.state.currentuser.fullname} />
                      <h5 className="title">{this.state.currentuser.fullname}</h5>
                    </a>
                    <p className="description">@{this.state.currentuser.id}</p>
                  </div>
                </CardBody>
                <CardFooter>
                  <hr />

                  <div className="apikeys">
                    <h4 className="text-center">
                      Api Keys <i className="col nc-icon nc-simple-add text-success" onClick={() => this.addApiKey()} />
                    </h4>
                    <ul>
                      <code>{apikeys}</code>
                    </ul>
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col md="6">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Edit Profile</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="px-1" md="6">
                        <FormGroup>
                          <label>Username</label>
                          <Input defaultValue={this.state.currentuser.id} name="username" disabled placeholder="Username" type="text" />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>Email address</label>
                          <Input defaultValue={this.state.currentuser.email} name="email" placeholder="email" type="email" onChange={this.onChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>Full Name</label>
                          <Input defaultValue={this.state.currentuser.fullname} name="fullname" placeholder="full name" type="text" onChange={this.onChange} />
                        </FormGroup>
                      </Col>
                      {/* <Col md="6">
                        <FormGroup>
                          <label>User Type </label>
                          <p>
                            <select name="user_type" onChange={this.onChange}>
                              <option value="Normal">Normal</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </p>
                        </FormGroup>
                      </Col> */}
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <label>Password</label>
                          <Input placeholder="password" name="password" type="password" onChange={this.onChange} />
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <label>Re-enter Password</label>
                          <Input placeholder="password" name="confirmpassword" type="password" onChange={this.onChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <Button className="btn-round" color="primary" onClick={this.editProfile}>
                          Update Profile
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Agents />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default withAuth(UserProfile);
