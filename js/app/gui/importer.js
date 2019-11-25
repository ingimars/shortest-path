import React, { Component } from "react";
import PresetData from "../logic/preset_data";
import Utils from "../logic/utils";

export default class Importer extends Component {
  
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();
  }

  setData(lines) {
    let data = lines.map(line => {
      let split = line.split(' ');
      if (split.length < 2)
        return null;
      let x = parseFloat(split[0]),
          y = parseFloat(split[1]);
      if (isNaN(x) || isNaN(y))
        return null;
      return {x: x, y: y};
    }).filter(val => val !== null);
    this.props.setPointsCallback(data);
  }

  handleImportData(e) {
    let self = this,
        reader = new FileReader();
    reader.onload = function() {self.setData(this.result.split('\n'));};
    reader.readAsText(e.target.files[0]);
  }

  clickImportData() {
    this.uploadRef.current.click();
  }

  clickPresetData() {
    this.props.setPointsCallback(PresetData.get());
  }

  clickRandomData() {
    let pointCount = 10,
        arr = new Array(pointCount),
        genrFun = () => parseFloat(Utils.randomRange(50, 500).toFixed(2));
    for (let i = 0; i < pointCount; i++)
      arr[i] = {x: genrFun(), y: genrFun()};
    this.props.setPointsCallback(arr);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row p-2">
          <div className="col-sm text-center p-1">
            <input type="file" className="hiddenFileInput" ref={this.uploadRef} onChange={this.handleImportData.bind(this)} />
            <button type="button" className="btn btn-block btn-primary" onClick={this.clickImportData.bind(this)}>Import</button>
          </div>
          <div className="col-sm text-center p-1">
            <button type="button" className="btn btn-block btn-primary" onClick={this.clickRandomData.bind(this)}>Random</button>
          </div>
          <div className="col-sm text-center p-1">
            <button type="button" className="btn btn-block btn-primary" onClick={this.clickPresetData.bind(this)}>Preset</button>
          </div>
        </div>
      </div>
    );
  }
}