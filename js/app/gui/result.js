import React, { Component } from "react";


export default class Result extends Component {

  render() {
    return (
      <div className="container">
        <div className="p-2 border bg-light">
          <div>
            <div>Distance</div>
            <div className="p-2">{this.props.result.distance}</div>
          </div>
          <div>
            <div>Duration</div>
            <div className="p-2">{this.props.result.duration} ms</div>
          </div>
        </div>
      </div>
    );
  }

}