import React, { Component } from "react";
import Utils from "../logic/utils";
import Action from "../flux/action"

export default class Importer extends Component {
  
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();
  }

  setData(lines) {
    let points = lines.map(line => {
      let split = line.split(' ');
      if (split.length < 2)
        return null;
      let x = parseFloat(split[0]),
          y = parseFloat(split[1]);
      if (isNaN(x) || isNaN(y))
        return null;
      return {x: x, y: y};
    }).filter(val => val !== null);
    Action.setPoints(points);
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

  clickGenerate() {
    let selectedValue = 5;
    Action.setDialogData({
      content: (
        <div className="pb-5">
          <div className="form-group form-control-lg">
            <label>Select number of points to generate</label>
            <select className="form-control" onChange={e => selectedValue = parseInt(e.target.value)}>
              {[...Array(46).keys()].map((option, i) => <option key={i}>{option + 5}</option>)}
            </select>
          </div>
        </div>
      ),
      applyText: "Generate",
      applyFun: (closeFun) => {
        let genrFun = () => parseFloat(Utils.randomRange(-200, 600).toFixed(2));
        Action.setPoints([...Array(selectedValue).keys()].map(() => {
          return {x: genrFun(), y: genrFun()};
        }));
        closeFun();
      }
    });
    Action.showDialog();
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
            <button type="button" className="btn btn-block btn-primary" onClick={this.clickGenerate.bind(this)}>Generate</button>
          </div>
        </div>
      </div>
    );
  }
}