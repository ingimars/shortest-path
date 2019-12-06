import Utils from '../utils';

export default class Algorithm {

    constructor() {
      this.minPoints = 2;
      this.maxPoints = Number.MAX_SAFE_INTEGER;
      this.allPoints = [];
      this.startPoint = null;
      this.runResult = null;
      this.distance = 0.0;
      this.duration = 0;
    }

    find(startPoint) {
      console.log('algorithm find', startPoint);
      if (this.isPointCountOutOfBounds())
        return;

      this.startPoint = startPoint;
      this.distance = 0.0;
      let startTime = new Date;
      this.runResult = this.run(startPoint);
      this.duration = new Date() - startTime;
    }

    run() {
      console.log('implement by inheritor');
    }

    getStartPoint() {
      console.log('algorithm getStartPoint', this.startPoint);
      return this.startPoint;
    }

    getResult() {
      return this.runResult;
    }

    isPointCountOutOfBounds() {
      if (this.allPoints.length < this.minPoints)
        this.runResult = {result: false, reason: 'min', value: this.minPoints};
      else if (this.allPoints.length > this.maxPoints)
        this.runResult = {result: false, reason: 'max', value: this.maxPoints};
      return this.runResult !== null;
    }

    setStartPoint(startPoint) {
      console.log('algorithm setStartPoint', startPoint, this);
      this.startPoint = startPoint;
    }

    addDistance(distance) {
      this.distance += distance;
    }

    getDistance() {
      return this.distance;
    }

    setDistance(distance) {
      this.distance = distance;
    }

    getDuration() {
      return this.duration;
    }

    setPoints(points) {
      this.allPoints = points.map(p => {return {...p}});
    }

    removePointFromPoints(points, point) {
      if (point == null)
        return points;
      return points.filter(p => p.x !== point.x || p.y !== point.y);
    }
  
}