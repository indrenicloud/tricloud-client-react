import React, { Component } from 'react';

import {Terminal as xTerm} from 'xterm';

class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        
        const xterm = new xTerm();
        xterm.open(document.getElementById("terminal"));
        xterm.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    }

    render() {
            return (
            <div id="terminal"></div>
            );
    }


}
 
export default Terminal;