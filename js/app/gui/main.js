import React, { Component } from "react";
import Canvas from "./canvas";
import Importer from "./importer";
import Menu from "./menu";
import Result from "./result";
import Dialog from "./dialog";
import ExhaustiveSearch from "../logic/algorithms/exhaustive_search";
import NearestNeighbour from "../logic/algorithms/nearest_neighbour";

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
      runResult: {
        distance: null,
        duration: null
      },
      dialogData: {},
      isLoading: false
    }
  }

  runAlgorithm() {
    this.setState({isLoading: true});
    setTimeout(() => {
      let algorithm = this.state.algorithms[this.state.selectedAlgorithm];
      algorithm.setPoints(this.state.points);
      algorithm.find(this.state.selectedPoint);
      let r = algorithm.getResult();
      this.setState({isLoading: false});
      if (r.result)
        this.setState({
          startPoint: algorithm.getStartPoint(),
          runResult: {
            distance: algorithm.getDistance(),
            duration: algorithm.getDuration()
          }
        });
      else if (r.reason === "max")
        alert("Too many points. Algorithm can only handle at most " + r.value + " points");
      else
        alert("Too few points. Algorithm needs at least " + r.value + " points");
    }, 100);
  }

  selectAlgorithm(algorithm) {
    this.setState({selectedAlgorithm: algorithm});
  }

  setPointsCallback(points) {
    this.setState({
      points: points,
      startPoint: false,
      selectedPoint: null,
      runResult: {
        distance: null,
        duration: null
      }
    });
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
        {this.state.runResult.distance ? <Result result={this.state.runResult} /> : null}
      </div>
    );
  }

  removeDialog() {
    this.setState({dialogData: {visible: false}});
  }

  showDialog(dialogData) {
    this.setState({dialogData: {...dialogData, visible: true}});
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
            <Importer setPointsCallback={points => this.setPointsCallback(points)}
                      showDialogCallback={this.showDialog.bind(this)} />
            {this.renderActionMenu()}
          </div>
        </div>
        <Dialog dialogData={this.state.dialogData}
                removeDialogCallback={this.removeDialog.bind(this)} />
        {this.state.isLoading ? <div className="pageOverlay"><img src="./images/loading.gif" /></div> : null}
      </div>
    );
  }
}