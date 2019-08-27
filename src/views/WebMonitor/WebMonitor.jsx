import React, { Component } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import Api from "../../service/Api";
import { Link } from "react-router-dom";
import withAuth from "components/Login/withAuth";

const api = new Api();
class WebMonitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      websites: [],
      newwebsite: {
        url: "",
        name: ""
      }
    };

    this.getWebsites = this.getWebsites.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getWebsites();
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  getWebsites() {
    api.getData("/api/websites").then(resp => {
      console.log(resp.data);
      this.setState({
        websites: resp.data
      });
    });
  }
  handleDelete(key) {
    api.deleteData("/api/websites/" + key).then(resp => {
      this.setState({
        websites: resp.data
      });
    });
  }

  onChange(e) {
    const { newwebsite } = { ...this.state };
    const currentState = newwebsite;
    const { name, value } = e.target;
    currentState[name] = value;
    this.setState({ newwebsite: currentState });
  }

  handleSubmit(e) {
    const form = {
      url: this.state.newwebsite.url,
      name: this.state.newwebsite.name,
      user: this.props.user.u
    };
    api.postData("/api/websites", form).then(resp => {
      this.setState({
        modal: !this.state.modal,
        websites: resp.data
      });
    });
    e.preventDefault();
  }

  render() {
    return (
      <div className="content">
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <form>
            <ModalHeader>Add New Website</ModalHeader>
            <ModalBody>
              <div className="row">
                <div className="form-group col-md-12">
                  <label>Name: </label>
                  <input type="text" name="name" value={this.state.newwebsite.name} onChange={this.onChange} className="form-control" />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-12">
                  <label>URL:</label>
                  <input type="url" name="url" value={this.state.newwebsite.url} onChange={this.onChange} className="form-control" />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleSubmit}>
                Add
              </Button>{" "}
              <Button color="secondary" onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Web Monitoring System</CardTitle>
                <i className="col nc-icon nc-simple-add text-success" onClick={this.toggle} />
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>URL</th>
                      <th>Status</th>
                      <th>Last Checked</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.websites.map(prop => {
                      var website_name = prop.name.replace(prop.Subscriber + "_", "");
                      return (
                        <tr>
                          <td>{website_name}</td>
                          <td>{prop.url}</td>
                          <td>
                            {" "}
                            <button className={prop.active ? "btn btn-success" : "btn btn-danger"}> {prop.active ? "UP" : "Down"} </button>
                          </td>
                          <td>{Date(prop.Timestamp)}</td>

                          <td>
                            <div className="row">
                              <Link to="#">
                                <i className="col nc-icon nc-refresh-69 text-success" onClick={() => this.getWebsites()} />
                              </Link>
                              <Link to="#">
                                <i className="col nc-icon nc-simple-remove text-danger delete-btn" onClick={() => this.handleDelete(prop.name)} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withAuth(WebMonitor);
