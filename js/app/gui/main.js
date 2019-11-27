import React, { Component } from "react";
import Store from "../flux/store"
import Canvas from "./canvas";
import Importer from "./importer";
import Menu from "./menu";
import Result from "./result";
import Dialog from "./dialog";

export default class Main extends Component {

  constructor() {
    super();
    this.state = this.getStoreState();
    Store.addChangeListener((c) => this.setState(this.getStoreState()));
  }

  getStoreState() {
    return {
      points: Store.getPoints(),
      selectedPoint: Store.getSelectedPoint(),
      dialogData: Store.getDialogData(),
      isLoading: Store.isLoading()
    }
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
    return (
      <div>
        <Menu />
        <Result />
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
    let isMissingData = !this.state.points.length || !this.state.selectedPoint;
    return (
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col-9 bg-dark p-0">
            <Canvas  />
          </div>
          <div className="col-3 bg-light p-0">
            <Importer />
            {isMissingData ? this.renderMissingData() : this.renderActionMenu()}
          </div>
        </div>
        <Dialog />
        {this.state.isLoading ? <div className="pageOverlay"><img src="./images/loading.gif" /></div> : null}
      </div>
    );
  }
}