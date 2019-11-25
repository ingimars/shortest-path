import React, { Component } from "react";
import Canvas from "./canvas"
import Importer from "./importer"
import Menu from "./menu"
import PointList from "./point_list"
import ExhaustiveSearch from "../logic/algorithms/exhaustive_search"
import NearestNeighbour from "../logic/algorithms/nearest_neighbour"

export default class Main extends Component {

  constructor() {
    super();
    this.state = {
      points: [],
      selectedPoint: null,
      selectedAlgorithm: "Nearest neighbour",
      startPoint: false,
      algorithms: {
        "Nearest neighbour": new NearestNeighbour(),
        "Exhaustive search": new ExhaustiveSearch()
      },
      isLoading: false
    }
  }

  runAlgorithm() {
    this.setState({isLoading: true});
    setTimeout(() => {
      let algorithm = this.state.algorithms[this.state.selectedAlgorithm];
      algorithm.setPoints(this.state.points);
      algorithm.find(this.state.selectedPoint);
      this.setState({startPoint: algorithm.getStartPoint(), isLoading: false});
    }, 100);
  }

  selectAlgorithm(algorithm) {
    this.setState({selectedAlgorithm: algorithm});
  }

  setPointsCallback(points) {
    this.setState({points: points, startPoint: false, selectedPoint: null});
  }

  renderMissingData() {
    let text = "Select point..";
    if (!this.state.points.length)
      text = "No data..";
    return (
      <div className="container">
        <div className="p-2 text-center">{text}</div>
      </div>
    );
  }

  renderActionMenu() {
    if (!this.state.points.length || !this.state.selectedPoint)
        return this.renderMissingData();

    return (
      <div>
          <Menu algorithms={Object.keys(this.state.algorithms)}
                runAlgorithmCallback={(algorithm) => this.runAlgorithm(algorithm)}
                selectAlgorithmCallback={this.selectAlgorithm.bind(this)}
                selectedAlgorithm={this.state.selectedAlgorithm}
                selectedPoint={this.state.selectedPoint} />
          {/* <PointList points={this.state.points}
                      selectedPoint={this.state.selectedPoint}
                      setSelectedPoint={p => this.setState({selectedPoint: p})} /> */}
          
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-9 bg-dark p-0">
            <Canvas points={this.state.points}
                    startPoint={this.state.startPoint}
                    selectedPoint={this.state.selectedPoint}
                    setSelectedPointCallback={p => this.setState({selectedPoint: p})} />
          </div>
          <div className="col-3 bg-light p-0">
            <Importer setPointsCallback={points => this.setPointsCallback(points)} />
            {this.renderActionMenu()}
          </div>
        </div>
        {this.state.isLoading ? <div className="pageOverlay"><img src="./images/loading.gif" /></div> : null}
      </div>
    );
  }
}