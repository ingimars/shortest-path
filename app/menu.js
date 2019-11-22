import React, { Component } from "react";

export default class Menu extends Component {

  render() {
    if (!this.props.selectedPoint)
        return <div>Select point..</div>
    return (
      <div className="text-center">
        <button type="button" className="btn btn-success" onClick={() => this.props.findNearestNeighbour()}>
            Nearest Neighbour
        </button>
      </div>
    );
  }
}