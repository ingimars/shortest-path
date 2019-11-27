import React, { Component } from "react";
import Store from "../flux/store"
import Action from "../flux/action"

export default class Canvas extends Component {

  constructor() {
    super();
    this.canvasRef = React.createRef();
    this.drawPathInterval = null;
    this.state = {...this.getStoreState(), width: 100, height: 100, mousePos: false};
    window.onresize = this.setupCanvas.bind(this);
    Store.addChangeListener((c) => this.setState(this.getStoreState()));
  }

  componentDidMount() {
    this.setupCanvas();
  }

  componentDidUpdate(prevProps, prevState) {
    let isNewStartPoint = prevState.startPoint !== this.state.startPoint && this.state.startPoint;
    if (prevState.points !== this.state.points 
          || (this.state.selectedPoint && prevState.selectedPoint !== this.state.selectedPoint)
          || isNewStartPoint)
      this.setupCanvas();
    if (isNewStartPoint)
      setTimeout(this.drawPath.bind(this), 100);
  }

  getStoreState() {
    return {
      points: Store.getPoints(),
      selectedPoint: Store.getSelectedPoint(),
      startPoint: Store.getStartPoint()
    };
  }

  stopDrawing() {
    if (this.drawPathInterval !== null)
      clearInterval(this.drawPathInterval);
    this.drawPathInterval = null;
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
    this.stopDrawing();
    let current = this.state.startPoint;
    this.drawPathInterval = setInterval(() => {
      this.drawLine(current.xScaled, current.yScaled, current.next.xScaled, current.next.yScaled, "red")
      current = current.next;
      if (current === this.state.startPoint)
        clearInterval(this.drawPathInterval);
    }, 200);
  }

  drawPoints() {
    let ctx = this.getContext();
    this.state.points.forEach((p, i) => {
      let isSelected = p === this.state.selectedPoint;
      ctx.fillStyle = isSelected ? "blue" : "black";
      ctx.beginPath();
      ctx.arc(p.xScaled, p.yScaled, isSelected ? 7 : 5, 0, Math.PI * 2, true);
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
    return this.state.points.reduce((acc, p) => Math.abs(p.xScaled - x) < 4.5 && Math.abs(p.yScaled - y) < 4.5 ? p : acc, false);
  }

  onClick() {
    if (!this.state.mousePos)
      return;
    this.drawPoints();
    Action.setSelectedPoint(this.state.mousePos);
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

    boundaries.x.min = Math.min(0, reduceFn('x', minFn));
    boundaries.x.max = reduceFn('x', maxFn);
    boundaries.x.size = boundaries.x.max - boundaries.x.min;
    let borderX = Math.min(Math.round(.15 * boundaries.x.size), 100.0);
    boundaries.x.size += (2.0 * borderX);
    boundaries.x.min -= borderX;
    boundaries.x.max += borderX;
    boundaries.x.offset = boundaries.x.min < 0 ? Math.abs(boundaries.x.min) : 0;

    boundaries.y.min = Math.min(0, reduceFn('y', minFn));
    boundaries.y.max = reduceFn('y', maxFn);
    boundaries.y.size = boundaries.y.max - boundaries.y.min;
    let borderY = Math.min(Math.round(.15 * boundaries.y.size), 100.0);
    boundaries.y.size += (2.0 * borderY);
    boundaries.y.min -= borderY;
    boundaries.y.max += borderY;
    boundaries.y.offset = boundaries.y.min < 0 ? Math.abs(boundaries.y.min) : 0;

    boundaries.ratio = {x: this.state.width / boundaries.x.size, y: this.state.height / boundaries.y.size};

    return boundaries;
  }

  setupBoundaries() {
    let b = this.getBoundaries(this.state.points);

    this.scaleForCanvas = (point) => {
      point.xScaled = ((point.x + b.x.offset) * b.ratio.x);
      let yScaled = ((point.y + b.y.offset) * b.ratio.y);
      point.yScaled = b.canvas.offsetHeight - yScaled + b.canvas.offsetTop;
      return point;
    };

    let markerRangeFun = (start, size, ax) => {
        let markerCount = 12,
            roundFun = val => Math.round(val / 10.0) * 10,
            markerSize = roundFun(size / markerCount),
            startVal = roundFun(start),
            arr = [];
        for (let i = 0; i < markerCount; i++) {
          let val = startVal + (i * markerSize),
              distanceFromAx = Math.abs(ax - val);
          if (distanceFromAx > markerSize)
            arr.push(val);
        }
        return arr;
      },
      axRangeSize = Math.round(.015 * Math.max(b.x.size, b.y.size)),
      axRange = {
        xFrom: b.ax.x - axRangeSize,
        xTo: b.ax.x + axRangeSize,
        xSize: (b.x.size + b.x.offset) * 1.25,
        yFrom: b.ax.y - axRangeSize,
        yTo: b.ax.y + axRangeSize,
        ySize: (b.y.size + b.y.offset) * 1.25
      };
      this.axes = {
      x: {
        start: this.scaleForCanvas({x: b.ax.x, y: b.y.min - b.y.size}),
        end: this.scaleForCanvas({x: b.ax.x, y: b.y.max + b.y.size}),
        markers: markerRangeFun(b.x.min, axRange.xSize, b.ax.x).map(x => {
          return {
            from: this.scaleForCanvas({x: x, y: axRange.yFrom}),
            to: this.scaleForCanvas({x: x, y: axRange.yTo}),
            text: x
          }
        })  
      },
      y: {
        start: this.scaleForCanvas({x: b.x.min - b.x.size, y: b.ax.y}),
        end: this.scaleForCanvas({x: b.x.max + b.x.size, y: b.ax.y}),
        markers: markerRangeFun(b.y.min, axRange.ySize, b.ax.y).map(y => {
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
      this.stopDrawing();
      this.getContext().clearRect(0, 0, this.state.width, this.state.height);
      this.setupBoundaries();
      this.drawAxes();
      this.state.points.forEach(p => this.scaleForCanvas(p));
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