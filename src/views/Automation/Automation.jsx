import React, { Component } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Row, Col, Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";

class Automation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
                        <th>Title</th>
                        <th>Platform</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody />
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
