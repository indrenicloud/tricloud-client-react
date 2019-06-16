import React, { Component, Fragment } from "react";
import { Container } from "reactstrap";
import Ficon from "./IconButton";

export default class FmHead extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container fluid>
        {/* BACK */}
        <div className="navarrow-cont">
          <Ficon doaction={this.props.doaction} name="back">
            <path d="M30.83 32.67l-9.17-9.17 9.17-9.17L28 11.5l-12 12 12 12z" />
          </Ficon>
          <Ficon doaction={this.props.doaction}>
            <path d="M17.17 32.92l9.17-9.17-9.17-9.17L20 11.75l12 12-12 12z" />
          </Ficon>
        </div>
        <div>
          {/* ADDDESS BAR */}
          <input className="form-control" value={this.props.path} />
        </div>
        <div>
          {/* RENAME*/}
          <Ficon doaction={this.props.doaction} name="rename">
            <path d="M 35.698906,6.7392765 H 9.730025 c -2.0404121,0 -3.7098401,1.669428 -3.7098401,3.7098405 v 25.968881 c 0,2.040412 1.669428,3.709841 3.7098401,3.709841 h 25.968881 c 2.040412,0 3.709841,-1.669429 3.709841,-3.709841 V 10.449117 c 0,-2.0404125 -1.669429,-3.7098405 -3.709841,-3.7098405 z M 11.584945,32.708158 v -4.581652 l 14.61677,-14.616771 c 0.370984,-0.370984 0.946009,-0.370984 1.316994,0 l 3.283208,3.283208 c 0.370984,0.370985 0.370984,0.94601 0,1.316994 l -14.63532,14.598221 z m 22.259041,0 H 19.932085 l 3.70984,-3.70984 h 10.202061 z" />
          </Ficon>
          {/* DELETE*/}
          <Ficon doaction={this.props.doaction} name="delete">
            <path d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4V14H12v24zM38 8h-7l-2-2H19l-2 2h-7v4h28V8z" />
          </Ficon>

          {/* CREATE FOLDER */}
          <Ficon doaction={this.props.doaction} name="mkdir">
            <path d="M40 12H24l-4-4H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4zm-2 16h-6v6h-4v-6h-6v-4h6v-6h4v6h6v4z" />
          </Ficon>

          {/* UPLOAD*/}
          <Ficon doaction={this.props.doaction} name="upload">
            <path d="M18 32h12V20h8L24 6 10 20h8zm-8 4h28v4H10z" />
          </Ficon>
        </div>
      </Container>
    );
  }
}
