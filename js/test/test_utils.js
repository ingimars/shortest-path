import Assert from 'assert';
import Utils from '../app/logic/utils';

export default class TestUtils {

    static correctPathData(shortastPathAlgorithm) {
      let initData = {
        points: [
          {x: 5, y: 1},
          {x: 1, y: 0},
          {x: 3, y: 0},
          {x: 3, y: 10},
          {x: 5, y: 0}
        ],
        startingPoint: {x: 1, y: 0},
        correctPath: [
          {x: 1, y: 0},
          {x: 3, y: 0},
          {x: 5, y: 0},
          {x: 5, y: 1},
          {x: 3, y: 10}
        ]
      };
      shortastPathAlgorithm.setPoints(initData.points);
      shortastPathAlgorithm.find(initData.startingPoint);
      initData.shortastPathAlgorithm = shortastPathAlgorithm;
      return initData;
    }

    static runIsShortestDistance(algorithm) {
      let args = TestUtils.correctPathData(algorithm),
          correctTotalDistance = 0.0;
      for (let i = 0; i < args.correctPath.length; i++) {
          let from = args.correctPath[i],
              to = (i + 1) === args.correctPath.length ? args.correctPath[0] : args.correctPath[i + 1];
          correctTotalDistance += Utils.distanceBetweenPoints(from, to);
      }
      Assert.equal(correctTotalDistance, args.shortastPathAlgorithm.getDistance());
    }

    static runHasLastPointLinkedToFirst(algorithm) {
      let args = TestUtils.correctPathData(algorithm),
          startPoint = args.shortastPathAlgorithm.getStartPoint(),
          lastPoint = startPoint.prev;
      Assert.equal(lastPoint.next, startPoint)
    }

}