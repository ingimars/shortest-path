import Utils from './utils'

export default class NearestNeighbour {

  constructor(allPoints) {
    this.allPoints = allPoints;
  }

  find(startPoint) {
    if (this.allPoints.length < 2)
      return null;

    let startPointCopy = {...startPoint},
        lastPoint = this.createLinkedList(startPointCopy, Utils.copyArrayOfObjects(this.allPoints));
    lastPoint.next = startPointCopy;
    return startPointCopy;
  }

  createLinkedList(currentPoint, neighbours) {
    let newNeighbours = this.removePointFromPoints(neighbours, currentPoint);
    if (!newNeighbours.length)
      return currentPoint;
    let nextPoint = this.nearestNeighbour(currentPoint, newNeighbours);
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