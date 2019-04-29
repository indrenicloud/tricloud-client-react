import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";
import withAuth from 'components/Login/withAuth';
import { thead } from 'variables/agents';
import Api from 'service/Api';
const api = new Api();
class Agents extends Component {
  constructor(props){
    super(props);
    this.state = {
      agents:null,
      agentsinfo: [],
      agentsempty : true,
    };
  }

  componentDidMount() {
    this.getAgents();
  }
  componentDidUpdate(){
  
  this.getAgents();

  } 

  getAgents(){
    api.getData('/api/agents').then(result=>{
      let agentsinfos = [];
      if(result.data.length>0){
      result.data.map(function(key){
        const info = {
          data : [key.id,key.systeminfo.os, key.systeminfo.hostname,key.owner, key.systeminfo.platform+" "+key.systeminfo.platformVersion, key.active?"Active":"Inactive"]
        };
        agentsinfos.push(info);
        
      })
      this.setState({
        agentsinfo:agentsinfos,
        agentsempty : false,
      });
    }else{
      this.setState({
        agentsinfo: [],
        agentsempty : true,
      });
    }
    });
  }

  componentWillUnmount(){
    this.setState({
      agentsempty : true,
    });
  }
    render() { 
      let emptyinfo;
      if(this.state.agentsempty){
        emptyinfo= <div><center>Agent not found</center></div>;
      }
        return (
          <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">List of Agents</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      {thead.map((prop, key) => {
                        if (key === thead.length - 1)
                          return (
                            <th key={key} className="text-right">
                              {prop}
                            </th>
                          );
                        return <th key={key}>{prop}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.agentsinfo.map((prop, key) => {
                      return (
                        <tr key={key}>
                          {prop.data.map((prop, key) => {
                            return <td key={key}>{prop}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                  
                </Table>
                {emptyinfo}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>    
        );
    }
}
 
export default withAuth(Agents);