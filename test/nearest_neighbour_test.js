import Assert from 'assert';
import NearestNeighbour from '../app/nearest_neighbour';
describe('NearestNeighbour', () => {
  it('should find nearest point', () => {
    let points = [
          {x: 1, y: 0},
          {x: 3, y: 0},
          {x: 3, y: 10},
          {x: 4, y: 3}
        ],
        correctPath = [
          {x: 3, y: 0},
          {x: 1, y: 0},
          {x: 4, y: 3},
          {x: 3, y: 10}
        ],
        currentPoint = (new NearestNeighbour(points)).find({x: 3, y: 0}),
        i = 0;

    do {
      let p = correctPath[i++];
      Assert.equal(p.x, currentPoint.x);
      Assert.equal(p.y, currentPoint.y);
      currentPoint = currentPoint.next;
    } while(i < points.length)
  });
});