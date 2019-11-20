import React, { Component } from "react";

export default class Canvas extends Component {

  constructor() {
    super();
    this.canvasRef = React.createRef();
    this.points = [];
    this.selectedPoint = null;
    this.state = {width: 100, height: 100, mousePos: false}
  }

  componentDidMount() {
    this.setupCanvas();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.points !== this.props.points)
      this.setPoints();
  }

  drawPoints() {
    let canvas = this.canvasRef.current,
        ctx = canvas.getContext("2d");
    this.points.forEach((p, i) => {
      ctx.fillStyle = p === this.selectedPoint ? "blue" : "darkgray";
      ctx.beginPath();
      let yScaled = canvas.offsetHeight - p.yScaled + canvas.offsetTop;
      ctx.arc(p.xScaled, yScaled, 5, 0, Math.PI * 2, true);
      ctx.fill();
    });
  }

  hoveringPoint(pageX, pageY) {
    let canvas = this.canvasRef.current,
        x = pageX - canvas.offsetLeft,
        y = canvas.offsetHeight - pageY + canvas.offsetTop;
    return this.points.reduce((acc, p) => Math.abs(p.xScaled - x) < 4.0 && Math.abs(p.yScaled - y) < 4.0 ? p : acc, false);
  }

  onClick(evt) {
    if (!this.state.mousePos)
      return;
    this.selectedPoint = this.state.mousePos;
    let canvas = this.canvasRef.current,
        context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawPoints();
  }

  onMouseMove(evt) {
    this.setState({mousePos: this.hoveringPoint(evt.pageX, evt.pageY)});
  }

  setPoints() {
    let reduceFn = (field, fn, init) => this.props.points.reduce(fn(field), init),
        maxFn = (field) => (acc, p) => p[field] > acc ? p[field] : acc,
        xMax = reduceFn('x', maxFn, 0),
        yMax = reduceFn('y', maxFn, 0),
        ratio = xMax / this.state.width;
    if (xMax < yMax)
      ratio = yMax / this.state.height;

    this.points = this.props.points.map(p => {
      p.xScaled = p.x * ratio;
      p.yScaled = p.y * ratio;
      return p;
    });
    this.drawPoints();
  }

  setupCanvas() {
    this.setState({
      width: this.canvasRef.current.parentElement.offsetWidth,
      height: this.canvasRef.current.parentElement.offsetHeight
    });
  }

  render() {
    return (
      <div className="canvasParent">
        <canvas className={this.state.mousePos ? "cursorPointer" : ""}
                ref={this.canvasRef}
                onClick={this.onClick.bind(this)}
                onMouseMove={this.onMouseMove.bind(this)}
                width={this.state.width}
                height={this.state.height} />
      </div>
    );
  }
}