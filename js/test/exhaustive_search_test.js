import ExhaustiveSearch from '../app/logic/algorithms/exhaustive_search';
import TestUtils from './test_utils'

describe('ExhaustiveSearch', () => {
  it('has last point linked to first', () => TestUtils.runHasLastPointLinkedToFirst(new ExhaustiveSearch())),
  it('has shortest distance traveled', () => TestUtils.runIsShortestDistance(new ExhaustiveSearch()));
});
