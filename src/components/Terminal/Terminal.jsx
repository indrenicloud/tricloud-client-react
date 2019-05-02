import React, { Component } from 'react';

import './xterm.css';
class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        

       
    }

    componentDidMount() {
    }

    render() {
       
        return (
            <div ref="terminal"></div>
        );
     
    }


}
 
export default Terminal;