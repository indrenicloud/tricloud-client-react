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
      dummy:{},
      scripts: [],
       agents:[],
      modal: false,
      newscript: {
        name: "",
        code: "",
        platform: "",
        agent: "",
        user: ""
      }
    };
    this.getScripts = this.getScripts.bind(this);
    this.agentsref = React.createRef();
    this.userref = React.createRef();
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this); 
  }

  componentDidMount() {
    this.getScripts();
    this.getAgents();
  }

  getAgents(){
    api.getData("/api/agents").then(resp =>{
      let agent_list = []

      console.log("all agents", resp);
      if(resp.status == "ok"){
        if(resp.data.length >0){
          resp.data.forEach(agent => {
            agent_list.push({"id":agent.id, "name":agent.systeminfo.hostname, "owner": agent.owner})
          });

          this.setState({
            agents : agent_list
          })
        }
    }
    });
  }

  getScripts() {
    api.getData("/api/scripts").then(resp => {
      console.log(resp);
      if (resp.data.length > 0) {
        this.setState({
          scripts: resp.data
        });
      }
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


  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onChange(e) {
    const { newscript } = { ...this.state };
    const currentState = newscript;
    const { name, value } = e.target;
    console.log(name, "^^^", value)
    currentState[name] = value; 
    this.setState({ newscript: currentState });
  }

  handleSubmit(e) {
    const form = {
      name: this.state.newscript.name,
      code: this.state.newscript.code,
      agent: this.agentsref.current.value,
      user: this.userref.current.value,
      platform: "",
      type: ""
    };
    console.log(form)
    api.postData("/api/scripts", form).then(resp => {
      console.log(resp);
      this.setState({
        modal: !this.state.modal,
        dummy: resp.data
      });
      this.getScripts();
    });
    e.preventDefault();
  }

  handleDelete(prop) {
    api.deleteData("/api/scripts/" + prop.name).then(resp => {
      console.log(resp);
      if (resp.status == "ok") {
        const msg = "Script " + prop.name + " has been deleted successfully !";
        this.props.notify(msg, "success");
        this.getScripts();
      } else {
        this.props.notify("Script " + prop.name + " delete action failed !", "warning");
      }
    });
  }




  render() {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    let sval = ""
    if (this.state.agents.length > 0) {
      sval = this.state.agents[0].id ;
    }
    return (
        <div className="content">
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <form>
              <ModalHeader>Add New Script</ModalHeader>
              <ModalBody>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Name:</label>
                    <input type="text" name="name" value={this.state.newscript.name} onChange={this.onChange} className="form-control" />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Code:</label>
                    <textarea name="code" value={this.state.newscript.code} onChange={this.onChange} className="form-control" />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Agent:</label>
                    <select name="agent"  value={sval} ref={this.agentsref} onChange={this.onChange}>
                      {this.state.agents.map(agent=>{

                      return <option key={agent.id} value={agent.id} >{agent.name}</option>

                      })}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label>User:</label>
                    <input type="text" name="user" ref={this.userref} value={this.props.user.u} onChange={this.onChange} className="form-control" readOnly />
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
                            <td>{prop.agent}</td>

                            <td>
                              <div className="row">
                                {/* <Link to="#">
                                  <i className="col nc-icon nc-refresh-69 text-success" />
                                </Link> */}
                                <Link to="#">
                                  <i
                                    className="btn btn-primary"
                                    onClick={e => {
                                      this.runScripts(prop.name);
                                    }}
                                  >
                                    Run
                                  </i>
                                </Link>
                                <Link to="#">
                                  <i className="col nc-icon nc-simple-remove text-danger deletescript" onClick={() => this.handleDelete(prop)} />
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

export default withAuth(Automation);
