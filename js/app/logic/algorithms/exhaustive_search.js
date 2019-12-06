import Algorithm from './algorithm';
import Utils from '../utils';

export default class ExhaustiveSearch extends Algorithm {

  constructor() {
    super();
    this.maxPoints = 10;
    this.bestRoute = {startPoint: null, distance: Number.MAX_SAFE_INTEGER};
    this.possibleRoutes = [];
    this.distances = {};
  }

  run(startPoint, findFun) {
    let searchFun = findFun || this.heapPermutation.bind(this),
        points = this.removePointFromPoints(Utils.copyObjectArray(this.allPoints), startPoint),
        len = points.length;
    searchFun(points, len, len);

    this.possibleRoutes.forEach(arr => this.setBestRoute({...startPoint}, arr));
    this.setStartPoint(this.bestRoute.startPoint);
    this.setDistance(this.bestRoute.distance);
    return {result: true};
  }

  calculateDistance(p1, p2) {
    let key1 = `${p1.x}${p1.y}${p2.x}${p2.y}`,
        key2 = `${p2.x}${p2.y}${p1.x}${p1.y}`;
    if (this.distances[key1])
      return this.distances[key1];
    if (this.distances[key2])
      return this.distances[key2];
    
    let distance = Utils.distanceBetweenPoints(p1, p2);
    this.distances[key1] = distance;
    this.distances[key2] = distance;
    return distance;
  }

  setBestRoute(startPoint, arr) {
    startPoint.distanceFromPrev = this.calculateDistance(startPoint, arr[arr.length - 1]);
    startPoint.prev = arr[arr.length - 1];
    arr.unshift(startPoint);

    let totalDistance = startPoint.distanceFromPrev;
    for (let i = 1; i < arr.length; i++) {
      arr[i - 1].next = arr[i];
      arr[i].prev = arr[i - 1];
      arr[i].distanceFromPrev = this.calculateDistance(arr[i], arr[i - 1]);
      totalDistance += arr[i].distanceFromPrev;
      if (totalDistance >= this.bestRoute.distance)
        return;
    }
    arr[arr.length -1].next = arr[0];
    this.bestRoute = {
      distance: totalDistance,
      startPoint: arr[0]
    }
  }

  // https://en.wikipedia.org/wiki/Heap%27s_algorithm
  heapPermutation(arr, size, n) { 
    if (size == 1)
      this.possibleRoutes.push(Utils.copyObjectArray(arr));
   
    for (let i = 0; i < size; i++) { 
      this.heapPermutation(Utils.copyObjectArray(arr), size - 1, n); 
      if (size % 2 === 1) { 
        let tmp = arr[0]; 
        arr[0] = arr[size-1]; 
        arr[size-1] = tmp; 
      } else { 
        let tmp = arr[i]; 
        arr[i] = arr[size-1]; 
        arr[size-1] = tmp; 
      } 
    } 
  } 

}