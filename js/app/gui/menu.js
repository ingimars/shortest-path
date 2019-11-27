import React, { Component } from "react";
import Store from "../flux/store"
import Action from "../flux/action"

export default class Menu extends Component {

  constructor() {
    super();
    this.state = this.getStoreState();
    Store.addChangeListener((c) => this.setState(this.getStoreState()));
  }

  getStoreState() {
    return {
      algorithms: Store.getAlgorithms(),
      points: Store.getPoints(),
      selectedPoint: Store.getSelectedPoint(),
      selectedAlgorithm: Store.getSelectedAlgorithm()
    };
  }

  runAlgorithm() {
    Action.setIsLoading(true);
    setTimeout(() => {
      let algorithm = this.state.algorithms[this.state.selectedAlgorithm];
      algorithm.setPoints(this.state.points);
      algorithm.find(this.state.selectedPoint);
      let r = algorithm.getResult();
      Action.setIsLoading(false);
      if (r.result) {
        Action.setStartPoint(algorithm.getStartPoint());
        Action.setRunResult({
          distance: algorithm.getDistance(),
          duration: algorithm.getDuration()
        });
      } else if (r.reason === "max")
        this.showErrorDialog('Too many points. Algorithm can only handle at most ' + r.value + ' points');
      else
        this.showErrorDialog('Too few points. Algorithm needs at least ' + r.value + ' points');
    }, 100);
  }

  showErrorDialog(text) {
    Action.setDialogData({
      visible: true,
      content: (
        <div className="text-center">
          {text}
        </div>
      )
    });
  }

  render() {
    return (
      <div className="container">
        <div className="p-2 border bg-light text-center">
          <span>
          x: {this.state.selectedPoint.x} y: {this.state.selectedPoint.y}
          </span>
        </div>
        <div className="mt-2">
          <div className="form-group">
            <div className="form-group">
              <select className="form-control"
                      value={this.state.selectedAlgorithm}
                      onChange={e => Action.setSelectedAlgorithm(e.target.value)}>
                {Object.keys(this.state.algorithms).map((a, i) => <option key={i}>{a}</option>)}
              </select>
            </div>
          <div>
            <button type="button" className="btn btn-block btn-success" onClick={this.runAlgorithm.bind(this)}>Run</button>
          </div>
          </div>
        </div>
      </div>
    );
  }

}