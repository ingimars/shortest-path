import ExhaustiveSearch from './exhaustive_search';
import Utils from '../utils';

export default class KNearestNeighbour extends ExhaustiveSearch {

  constructor() {
    super();
    this.maxPoints = 12;
    this.k = 3;
  }

  run(startPoint) {
    return super.run(startPoint, (neighbours) => this.findNeighbourRoutes([startPoint], neighbours));
  }

  closestsNeighbours(pointOfInterest, neighbours) {
    return neighbours
            .map(p => Object.assign({distanceFromPrev: super.calculateDistance(pointOfInterest, p)}, p))
            .sort((a, b) => a.distanceFromPrev < b.distanceFromPrev)
            .slice(0, this.k);
  }

  findNeighbourRoutes(currentRoute, neighbours) {
    if (!neighbours.length) {
      this.possibleRoutes.push(Utils.copyObjectArray(currentRoute));
      return;
    }
    let beginPoint = currentRoute[currentRoute.length - 1],
        neighboursNoBeginPoint = super.removePointFromPoints(neighbours, beginPoint);
    this.closestsNeighbours(beginPoint, neighboursNoBeginPoint).forEach(currentPoint => {
      let availableNeighbours = super.removePointFromPoints(neighboursNoBeginPoint, currentPoint);
      this.findNeighbourRoutes([currentPoint].concat(currentRoute), availableNeighbours);
    });
  }

}