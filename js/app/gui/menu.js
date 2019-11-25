import React, { Component } from "react";

export default class Menu extends Component {

  constructor() {
    super();
    this.state = {

    }
  }

  render() {
    return (
      <div className="container">
        <div className="p-2 border bg-light text-center">
          <span>
          x: {this.props.selectedPoint.x} y: {this.props.selectedPoint.y}
          </span>
        </div>
        <div className="mt-2">
          <div className="form-group">
            <div className="form-group">
              <select className="form-control"
                      value={this.props.selectedAlgorithm}
                      onChange={e => this.props.selectAlgorithmCallback(e.target.value)}>
                {this.props.algorithms.map((a, i) => <option key={i}>{a}</option>)}
              </select>
            </div>
          <div>
            <button type="button" className="btn btn-block btn-success" onClick={this.props.runAlgorithmCallback}>Find shortest path</button>
          </div>
          </div>
        </div>
      </div>
    );
  }

}