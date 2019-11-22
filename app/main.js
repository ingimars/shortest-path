import React, { Component } from "react";
import Canvas from "./canvas"
import Importer from "./importer"
import Menu from "./menu"
import PointList from "./point_list"
import Utils from "./utils"
import NearestNeighbour from "./nearest_neighbour"

export default class Main extends Component {

  constructor() {
    super();
    this.state = {points: [], selectedPoint: null, startPoint: false}
  }

  findNearestNeighbour() {
    this.setState({startPoint: this.nearestNeighbour.find(this.state.selectedPoint)});
  }

  setPointsCallback(points) {
    this.setState({points: points, startPoint: false});
    this.nearestNeighbour = new NearestNeighbour(Utils.copyArrayOfObjects(points));
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
            <Menu findNearestNeighbour={this.findNearestNeighbour.bind(this)}
                  selectedPoint={this.state.selectedPoint} />
            <PointList points={this.state.points}
                       selectedPoint={this.state.selectedPoint}
                       setSelectedPoint={p => this.setState({selectedPoint: p})} />
            
          </div>
        </div>
      </div>
    );
  }
}