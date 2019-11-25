import Assert from 'assert';
import NearestNeighbour from '../app/logic/algorithms/nearest_neighbour';
import TestUtils from './test_utils'

describe('NearestNeighbour', () => {
  it('should find next neighbour', () => {
    let args = TestUtils.correctPathData(new NearestNeighbour()),
        currentPoint = args.shortastPathAlgorithm.getStartPoint(),
        i = 0;

    do {
      let p = args.correctPath[i++];
      Assert.equal(p.x, currentPoint.x);
      Assert.equal(p.y, currentPoint.y);
      currentPoint = currentPoint.next;
    } while(i < args.points.length)
  }),
  it('has last point linked to first', () => TestUtils.runHasLastPointLinkedToFirst(new NearestNeighbour())),
  it('has shortest distance traveled', () => TestUtils.runIsShortestDistance(new NearestNeighbour()));
});
