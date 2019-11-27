import React, { Component } from "react";
import Store from "../flux/store"

export default class Result extends Component {

  constructor() {
    super();
    this.state = this.getStoreState();
    Store.addChangeListener((c) => this.setState(this.getStoreState()));
  }

  getStoreState() {
    return {
      runResult: Store.getRunResult(),
      startPoint: Store.getStartPoint()
    };
  }

  render() {
    if (!this.state.runResult.duration)
      return null;

    return (
      <div className="container">
        <div className="p-2 border bg-light">
          <div>
            <div>Start point</div>
            <div className="p-2">x: {this.state.startPoint.x} y: {this.state.startPoint.y}</div>
          </div>
          <div>
            <div>Distance</div>
            <div className="p-2">{this.state.runResult.distance}</div>
          </div>
          <div>
            <div>Duration</div>
            <div className="p-2">{this.state.runResult.duration} ms</div>
          </div>
        </div>
      </div>
    );
  }

}