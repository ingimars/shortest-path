import Assert from 'assert';
import NearestNeighbour from '../app/logic/algorithms/nearest_neighbour';
import Utils from '../app/logic/utils';

describe('NearestNeighbour', () => {
  it('should find nearest point', () => {
    let args = correctPathRun(),
        currentPoint = args.nearestNeighbour.getStartPoint(),
        i = 0;

    do {
      let p = args.correctPath[i++];
      Assert.equal(p.x, currentPoint.x);
      Assert.equal(p.y, currentPoint.y);
      currentPoint = currentPoint.next;
    } while(i < args.points.length)
  }),
  it('has last point linked to first', () => {
    let args = correctPathRun(),
        startPoint = args.nearestNeighbour.getStartPoint(),
        lastPoint = startPoint.prev;
    Assert.equal(lastPoint.next, startPoint)
  }),
  it('has correct total distance traveled', () => {
    let args = correctPathRun(),
        correctTotalDistance = 0.0;
    for (let i = 0; i < args.correctPath.length; i++) {
        let from = args.correctPath[i],
            to = (i + 1) === args.correctPath.length ? args.correctPath[0] : args.correctPath[i + 1];
        correctTotalDistance += Utils.distanceBetweenPoints(from, to);
    }
    Assert.equal(correctTotalDistance, args.nearestNeighbour.getDistance());
  });
});

let correctPathRun = () => {
  let points = [
        {x: 1, y: 0},
        {x: 3, y: 0},
        {x: 3, y: 10},
        {x: 4, y: 3}
        ],
      startingPoint = {x: 3, y: 0},
      correctPath = [
        {x: 3, y: 0},
        {x: 1, y: 0},
        {x: 4, y: 3},
        {x: 3, y: 10}
      ],
      nearestNeighbour = new NearestNeighbour();
      nearestNeighbour.setPoints(points);
      nearestNeighbour.find(startingPoint);

  return {
    points: points,
    startingPoint: startingPoint,
    correctPath: correctPath,
    nearestNeighbour: nearestNeighbour
  }
};