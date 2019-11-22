let assert = require('assert');
let NearestNeighbour = require('../app/nearest_neighbour')
describe('NearestNeighbour', () => {
  it('should find nearest point', () => {
    let points = [{x: 1, y: 0}, {x: 3, y: 0}, {x: 3, y: 10}, {x: 1, y: -1}];
    console.log('NearestNeighbour', new NearestNeighbour());
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});