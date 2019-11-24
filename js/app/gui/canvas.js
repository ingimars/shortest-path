import React, { Component } from "react";

export default class Canvas extends Component {

  constructor() {
    super();
    this.canvasRef = React.createRef();
    this.selectedPoint = null;
    this.drawPathInterval = null;
    this.state = {width: 100, height: 100, mousePos: false}
    window.onresize = this.setupCanvas.bind(this);
  }

  componentDidMount() {
    this.setupCanvas();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.points !== this.props.points)
      this.setupCanvas();
    if (prevProps.startPoint !== this.props.startPoint && this.props.startPoint)
      this.drawPath();
    if (this.props.selectedPoint && prevProps.selectedPoint !== this.props.selectedPoint) {
      this.selectedPoint = this.props.selectedPoint;
      this.setupCanvas();
    }
  }

  drawLine(x1, y1, x2, y2, color) {
    let ctx = this.getContext();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color || "black";
    ctx.stroke(); 
  }

  drawPath() {
    if (this.drawPathInterval !== null)
      clearInterval(this.drawPathInterval);

    let current = this.props.startPoint;
    this.drawPathInterval = setInterval(() => {
      this.drawLine(current.xScaled, current.yScaled, current.next.xScaled, current.next.yScaled, "red")
      current = current.next;
      if (current === this.props.startPoint)
        clearInterval(this.drawPathInterval);
    }, 200);
  }

  drawPoints() {
    let ctx = this.getContext();
    this.props.points.forEach((p, i) => {
      ctx.fillStyle = p === this.selectedPoint ? "blue" : "darkgray";
      ctx.beginPath();
      ctx.arc(p.xScaled, p.yScaled, 5, 0, Math.PI * 2, true);
      ctx.fill();
    });
  }

  drawAxes() {
    Object.keys(this.axes).forEach(ax => {
      let p = this.axes[ax];
      this.drawLine(p.start.xScaled, p.start.yScaled, p.end.xScaled, p.end.yScaled);
      p.markers.forEach(marker => {
        this.drawLine(marker.from.xScaled, marker.from.yScaled, marker.to.xScaled, marker.to.yScaled);
        if (!marker.text) return;
        switch(ax) {
          case 'x':
            this.drawText(marker.from.xScaled - 12, marker.from.yScaled + 20, marker.text);
            break;  
          case 'y':
            this.drawText(marker.from.xScaled - 50, marker.from.yScaled + 5, marker.text);
            break;
        }
      });
    });
  }

  drawText(x, y, text) {
    let ctx = this.getContext();
    ctx.fillStyle = "black";
    ctx.font =  "15px Arial";
    ctx.fillText(text, x, y);
  }

  getContext() {
    return this.canvasRef.current.getContext("2d");
  }

  hoveringPoint(pageX, pageY) {
    let canvas = this.canvasRef.current,
        x = pageX - canvas.offsetLeft,
        y = pageY - canvas.offsetLeft;
    return this.props.points.reduce((acc, p) => Math.abs(p.xScaled - x) < 4.0 && Math.abs(p.yScaled - y) < 4.0 ? p : acc, false);
  }

  onClick() {
    if (!this.state.mousePos)
      return;
    this.selectedPoint = this.state.mousePos;
    this.drawPoints();
    this.props.setSelectedPointCallback(this.selectedPoint);
  }

  onMouseMove(evt) {
    this.setState({mousePos: this.hoveringPoint(evt.pageX, evt.pageY)});
  }

  getBoundaries(points) {
    if (!points.length)
      points = [{x: 0, y: 200}, {x: 200, y: 0}];

    let boundaries = {
          canvas: {
            offsetHeight: this.canvasRef.current.offsetHeight,
            offsetTop: this.canvasRef.current.offsetTop
          },
          x: {min: 0, max: 0, size: 0, offset: 0},
          y: {min: 0, max: 0, size: 0, offset: 0},
          ratio: {x: 1.0, y: 1.0},
          ax: {x: 0, y: 0}
        },
        reduceFn = (field, fn) => points.reduce(fn(field), null),
        maxFn = (field) => (acc, p) => acc === null || p[field] > acc ? p[field] : acc,
        minFn = (field) => (acc, p) => acc === null || p[field] < acc ? p[field] : acc;

    boundaries.x.min = reduceFn('x', minFn);
    boundaries.x.max = reduceFn('x', maxFn);
    boundaries.x.size = boundaries.x.max - boundaries.x.min;
    let borderX = Math.min(Math.round(.15 * boundaries.x.size), 100.0);
    boundaries.x.size += (2.0 * borderX);
    boundaries.x.min -= borderX;
    boundaries.x.max += borderX;
    boundaries.x.offset = boundaries.x.min < 0 ? Math.abs(boundaries.x.min) : 0;

    boundaries.y.min = reduceFn('y', minFn);
    boundaries.y.max = reduceFn('y', maxFn);
    boundaries.y.size = boundaries.y.max - boundaries.y.min;
    let borderY = Math.min(Math.round(.15 * boundaries.y.size), 100.0);
    boundaries.y.size += (2.0 * borderY);
    boundaries.y.min -= borderY;
    boundaries.y.max += borderY;
    boundaries.y.offset = boundaries.y.min < 0 ? Math.abs(boundaries.y.min) : 0;

    let axFun = (val) => Math.round(val / 1000) * 1000;
    boundaries.ax = {
      x: axFun(boundaries.x.min < 0 ? 0 : boundaries.x.min),
      y: axFun(boundaries.y.min < 0 ? 0 : boundaries.y.min)
    }

    boundaries.ratio = {x: this.state.width / boundaries.x.size, y: this.state.height / boundaries.y.size};

    return boundaries;
  }

  setupBoundaries() {
    let b = this.getBoundaries(this.props.points);

    this.scaleForCanvas = (point) => {
      point.xScaled = ((point.x + b.x.offset) * b.ratio.x);
      let yScaled = ((point.y + b.y.offset) * b.ratio.y);
      point.yScaled = b.canvas.offsetHeight - yScaled + b.canvas.offsetTop;
      return point;
    };

    let markerRangeFun = (min, size) => {
        let markerCount = 12,
            ratio = (size > 999 ? 100.0 : 10.0),
            roundFun = val => Math.round(val / ratio) * ratio,
            markerSize = roundFun(size / markerCount),
            minVal = roundFun(min),
            arr = [];
        for (let i = 0; i < markerCount; i++) {
          let val = minVal + (i * markerSize);
          if (val > 10)
            arr[i] = val;
        }
        return arr;
      },
      axRangeSize = Math.round(.015 * Math.max(b.x.size, b.y.size)),
      axRange = {
        xFrom: b.x.min + b.x.offset - axRangeSize,
        xTo: b.x.min + b.x.offset + axRangeSize,
        xSize: b.x.size + b.x.offset,
        yFrom: b.y.min + b.y.offset - axRangeSize,
        yTo: b.y.min + b.y.offset + axRangeSize,
        ySize: b.y.size + b.y.offset
      };
    this.axes = {
      x: {
        start: this.scaleForCanvas({x: b.ax.x, y: b.y.min}),
        end: this.scaleForCanvas({x: b.ax.x, y: b.y.max}),
        markers: markerRangeFun(b.x.min, axRange.xSize).map(x => {
          return {
            from: this.scaleForCanvas({x: x, y: axRange.yFrom}),
            to: this.scaleForCanvas({x: x, y: axRange.yTo}),
            text: x
          }
        })  
      },
      y: {
        start: this.scaleForCanvas({x: b.x.min, y: b.ax.y}),
        end: this.scaleForCanvas({x: b.x.max, y: b.ax.y}),
        markers: markerRangeFun(b.y.min, axRange.ySize).map(y => {
          return {
            from: this.scaleForCanvas({x: axRange.xFrom, y: y}),
            to: this.scaleForCanvas({x: axRange.xTo, y: y}),
            text: y
          }
        })
      }
    };
  }

  setupCanvas() {
    this.setState({
      width: this.canvasRef.current.parentElement.offsetWidth,
      height: this.canvasRef.current.parentElement.offsetHeight
    });
    setTimeout(() => {
      this.getContext().clearRect(0, 0, this.state.width, this.state.height);
      this.setupBoundaries();
      this.drawAxes();
      this.props.points.forEach(p => this.scaleForCanvas(p));
      this.drawPoints();
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