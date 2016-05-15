import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../src/actions/CardActions'
import expect from 'expect'; // You can use any testing library

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('card actions', () => {
  describe('useCheapest', () => {
    it('should add to cart cheapest combination of cards', () => {
      // TODO, https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md
      expect(1).toEqual(1);
    })
  })
})