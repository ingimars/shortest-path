import React, { Component } from "react";
import Canvas from "./canvas"
import Importer from "./importer"

export default class Main extends Component {

  constructor() {
    super();
    this.state = {points: []}
  }

  setPointsCallback(points) {
    this.setState({points: points});
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-9 bg-dark padding-0">
            <Canvas points={this.state.points} />
          </div>
          <div className="col-3 bg-light padding-5">
            <Importer setPointsCallback={this.setPointsCallback.bind(this)} />
            {JSON.stringify(this.state.points)}
          </div>
        </div>
      </div>
    );
  }
}