import React, { Component } from "react";

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

  render() {
    return (
      <div className="text-center">
        <input type="file" className="hiddenFileInput" ref={this.uploadRef} onChange={this.handleImportData.bind(this)} />
        <button type="button" className="btn btn-primary" onClick={this.clickImportData.bind(this)}>Import</button>
      </div>
    );
  }
}