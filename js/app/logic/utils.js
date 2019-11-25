export default class Utils {

  static distanceBetweenPoints(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  static randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static copyObjectArray(arr) {
    return arr.map(obj => {return {...obj}});
  }
}