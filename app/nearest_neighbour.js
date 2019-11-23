import Algorithm from './algorithm';
import Utils from './utils';

export default class NearestNeighbour extends Algorithm {

  constructor() {
    super();
  }

  run(startPoint) {
    if (this.allPoints.length < 2)
      return;

    let startPointCopy = {...startPoint};
    this.setStartPoint(startPointCopy);
    let lastPoint = this.createLinkedList(startPointCopy, this.allPoints);
    lastPoint.next = startPointCopy;
    startPointCopy.prev = lastPoint;
    startPointCopy.distanceFromPrev = Utils.distanceBetweenPoints(startPointCopy, lastPoint);
    this.addDistance(startPointCopy.distanceFromPrev);
  }

  createLinkedList(currentPoint, neighbours) {
    let newNeighbours = this.removePointFromPoints(neighbours, currentPoint);
    if (!newNeighbours.length)
      return currentPoint;
    let nextPoint = this.nearestNeighbour(currentPoint, newNeighbours);
    this.addDistance(nextPoint.distanceFromPrev);
    currentPoint.next = nextPoint;
    return this.createLinkedList(nextPoint, newNeighbours);
  }

  nearestNeighbour(currentPoint, neighbours) {
    if (!neighbours.length)
      return null;
    let nextPoint = null;
    for (let i = 0; i < neighbours.length; i++) {
      let checkPoint = neighbours[i];
      checkPoint.distanceFromPrev = Utils.distanceBetweenPoints(currentPoint, checkPoint);
      if (nextPoint === null || checkPoint.distanceFromPrev < nextPoint.distanceFromPrev)
        nextPoint = checkPoint;
    }
    if (nextPoint !== null)
      nextPoint.prev = currentPoint;
    return nextPoint;
  }

  removePointFromPoints(points, point) {
    if (point == null)
      return points;
    return points.filter(p => p.x !== point.x || p.y !== point.y);
  }

}