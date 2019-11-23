
export default class Algorithm {

    constructor() {
      this.allPoints = [];
      this.startPoint = null;
      this.distance = 0.0;
      this.duration = 0;
    }
    
    find(startPoint) {
      this.distance = 0.0;
      let startTime = new Date();
      this.run(startPoint);
      this.duration = new Date() - startTime;
    }

    run() {
      console.log('implement by inheritor');
    }

    getStartPoint() {
      return this.startPoint;
    }

    setStartPoint(startPoint) {
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

}