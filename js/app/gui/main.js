import React, { Component } from "react";
import Canvas from "./canvas"
import Importer from "./importer"
import Menu from "./menu"
import PointList from "./point_list"
import NearestNeighbour from "../logic/nearest_neighbour"

export default class Main extends Component {

  constructor() {
    super();
    this.nearestNeighbour = new NearestNeighbour();
    this.state = {
      points: [],
      selectedPoint: null,
      startPoint: false
    }
  }

  findNearestNeighbour() {
    this.nearestNeighbour.setPoints(this.state.points);
    this.nearestNeighbour.find(this.state.selectedPoint);
    this.setState({startPoint: this.nearestNeighbour.getStartPoint()});
  }

  setPointsCallback(points) {
    console.log('set points', points);
    this.setState({points: points, startPoint: false});
  }

  renderActionMenu() {
    if (!this.state.points.length)
        return (
            <div className="text-center">
                Data missing..
            </div>
        );

    return (
      <div>
          <Menu findNearestNeighbour={this.findNearestNeighbour.bind(this)}
                selectedPoint={this.state.selectedPoint} />
          <PointList points={this.state.points}
                      selectedPoint={this.state.selectedPoint}
                      setSelectedPoint={p => this.setState({selectedPoint: p})} />
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-9 bg-dark padding-0">
            <Canvas points={this.state.points}
                    startPoint={this.state.startPoint}
                    selectedPoint={this.state.selectedPoint}
                    setSelectedPointCallback={p => this.setState({selectedPoint: p})} />
          </div>
          <div className="col-3 bg-light padding-0">
            <Importer setPointsCallback={points => this.setPointsCallback(points)} />
            {this.renderActionMenu()}
          </div>
        </div>
      </div>
    );
  }
}