import React, { Component } from "react";

export default class Canvas extends Component {

  constructor() {
    super();
    this.canvasRef = React.createRef();
    this.selectedPoint = null;
    this.drawPathInterval = null;
    this.state = {width: 100, height: 100, mousePos: false}
  }

  componentDidMount() {
    this.setupCanvas();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.points !== this.props.points)
      this.setPoints();
    if (prevProps.startPoint !== this.props.startPoint && this.props.startPoint)
      this.drawPath();
    if (this.props.selectedPoint && prevProps.selectedPoint !== this.props.selectedPoint) {
      this.selectedPoint = this.props.selectedPoint;
      this.drawPoints();
    }
  }
  
  drawPath() {
    if (this.drawPathInterval !== null)
      clearInterval(this.drawPathInterval);

    let canvas = this.canvasRef.current,
        ctx = canvas.getContext("2d"),
        current = this.props.startPoint;

    this.drawPathInterval = setInterval(() => {
      ctx.beginPath();
      ctx.moveTo(current.xScaled, current.yScaled);
      ctx.lineTo(current.next.xScaled, current.next.yScaled);
      ctx.strokeStyle = "red";
      ctx.stroke();

      current = current.next;
      if (current === this.props.startPoint)
        clearInterval(this.drawPathInterval);
    }, 200);
  }

  drawPoints() {
    let canvas = this.canvasRef.current,
        ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawAxes();
    this.props.points.forEach((p, i) => {
      ctx.fillStyle = p === this.selectedPoint ? "blue" : "darkgray";
      ctx.beginPath();
      ctx.arc(p.xScaled, p.yScaled, 5, 0, Math.PI * 2, true);
      ctx.fill();
    });
  }

  drawAxes() {
    let canvas = this.canvasRef.current,
        ctx = canvas.getContext("2d");
    this.axes.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(p.start.xScaled, p.start.yScaled);
      ctx.lineTo(p.end.xScaled, p.end.yScaled);
      ctx.strokeStyle = "black";
      ctx.stroke();    
    });
  }

  hoveringPoint(pageX, pageY) {
    let canvas = this.canvasRef.current,
        x = pageX - canvas.offsetLeft,
        y = pageY - canvas.offsetLeft;
    return this.props.points.reduce((acc, p) => Math.abs(p.xScaled - x) < 4.0 && Math.abs(p.yScaled - y) < 4.0 ? p : acc, false);
  }

  onClick(evt) {
    if (!this.state.mousePos)
      return;
    this.selectedPoint = this.state.mousePos;
    this.drawPoints();
    this.props.setSelectedPointCallback(this.selectedPoint);
  }

  onMouseMove(evt) {
    this.setState({mousePos: this.hoveringPoint(evt.pageX, evt.pageY)});
  }

  setPoints() {
    this.setupBoundaries();
    this.props.points.forEach(p => this.scaleForCanvas(p));
    this.drawPoints();
  }

  setupBoundaries() {
    let canvas = this.canvasRef.current,
        reduceFn = (field, fn) => this.props.points.reduce(fn(field), null),
        maxFn = (field) => (acc, p) => acc === null || p[field] > acc ? p[field] : acc,
        minFn = (field) => (acc, p) => acc === null || p[field] < acc ? p[field] : acc,
        xMin = reduceFn('x', minFn),
        xMax = reduceFn('x', maxFn),
        yMin = reduceFn('y', minFn),
        yMax = reduceFn('y', maxFn),
        xSize = xMax - Math.abs(xMin),
        ySize = yMax - Math.abs(yMin),
        border = {
          'x': .10 * xSize,
          'y': .10 * ySize
        },
        planeRatio = {
          'y': ySize < xSize ? xSize / ySize : 1.0,
          'x': xSize < ySize ? ySize / xSize : 1.0
        },
        ratio = Math.max(
          (xMax - Math.abs(xMin) + (.5 * border['x'])) / this.state.width,
          (yMax - Math.abs(yMin) + (.5 * border['y'])) / this.state.height
        );

    this.scaleForCanvas = (point) => {
      point.xScaled = ((point.x * ratio) + border['x']) * planeRatio['x'];
      let yScaled = ((point.y * ratio) + border['y']) * planeRatio['y'];
      point.yScaled = canvas.offsetHeight - yScaled + canvas.offsetTop
      return point;
    };
    this.axes = [
      // X
      {
        start: this.scaleForCanvas({x: xMin, y: yMin - border['y']}),
        end:   this.scaleForCanvas({x: xMin, y: yMax + border['y']})
      },
      // Y
      {
        start: this.scaleForCanvas({x: xMin - border['x'], y: yMin}),
        end:   this.scaleForCanvas({x: xMax + border['x'], y: yMin})
      }
    ];
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