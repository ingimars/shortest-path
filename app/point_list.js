import React, { Component } from "react";

export default class PointList extends Component {

  render() {
    let points = this.props.points.map((p, i) =>
      <div className={"col-6 fakeLink" + (p === this.props.selectedPoint ? " font-weight-bold" : "")}
           key={i}
           onClick={() => this.props.setSelectedPoint(p)}>
          <span>({p.x}, {p.y})</span>
      </div>
    );
    return (
      <div className="pointlist">
        <div className="container">
          <div className="row h-100">
            {points}
          </div>
        </div>
      </div>
    );
  }
}