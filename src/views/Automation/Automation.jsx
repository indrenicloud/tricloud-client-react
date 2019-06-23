import React, { Component } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import Api from "../../service/Api";
import { Link } from "react-router-dom";
import withAuth from "components/Login/withAuth";

const api = new Api();
class Automation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scripts:[]
    };
    this.getScripts = this.getScripts.bind(this);
  }
  getScripts() {
    api.getData("/api/scripts").then(resp => {
      console.log(resp.data);
      this.setState({
        scripts: resp.data
      });
    });
  }

  runScripts(name) {
    api.getData("/api/scripts/" + name + "/run").then(resp => {
      console.log(resp.data);
      this.setState({
        scripts: resp.data
      });
    });
  }

  componentDidMount() {
    this.getScripts();
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Automation and Scripts</CardTitle>
                  <i className="col nc-icon nc-simple-add text-success" onClick={this.toggle} />
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Name</th>
                        <th>Platform</th>
                        <th>Agent</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.scripts.map(prop => {
                        
                        return (
                          <tr>
                            <td>{prop.name}</td>
                            <td>{prop.platform}</td>
                            <td>{prop.agent }</td>

                            <td>
                              <div className="row">
                                <Link to="#">
                                  <i className="col nc-icon nc-refresh-69 text-success" />
                                </Link>
                                <Link to="#">
                                  <i className="btn btn-primary" onClick={(e) =>{
                                    this.runScripts(prop.name);
                                  } } >Run</i>
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
      </>
    );
  }
}

export default Automation;
