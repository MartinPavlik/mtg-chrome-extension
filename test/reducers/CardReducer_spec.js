import expect from 'expect'
import reducer from '../../src/reducers/CardReducer'
import { NOT_LOADED, LOADING, LOADED } from '../../src/constants/LoadingStatus'
import { NOT_ORDERED, ORDERING, ORDERED } from '../../src/constants/OrderingStatus'
import * as types from '../../src/actions/CardActions'

describe('card reducer', () => {
  it('should handle ORDER_CARDS_REQUEST', () => {
    expect(
      reducer({
        orderingStatus: NOT_ORDERED
      }, {
        type: types.ORDER_CARDS_REQUEST,
      })
    ).toEqual(
      {
        orderingStatus: ORDERING
      }
    )
  })
  it('should handle ORDER_CARDS_DONE', () => {
    expect(
      reducer({
        orderingStatus: ORDERING
      }, {
        type: types.ORDER_CARDS_DONE,
      })
    ).toEqual(
      {
        orderingStatus: ORDERED
      }
    )
  })
  it('should handle LOAD_CARDS_REQUEST', () => {
    expect(
      reducer({}, {
        type: types.LOAD_CARDS_REQUEST,
        payload: {
          toBeLoaded: 5
        }
      })
    ).toEqual(
      {
        loadingStatus: LOADING,
        toBeLoaded: 5,
        loaded: 0
      }
    )
  })
  it('should handle LOAD_CARDS_DONE', () => {
    expect(
      reducer({
        loadingStatus: LOADING
      }, {
        type: types.LOAD_CARDS_DONE
      })
    ).toEqual(
      {
        loadingStatus: LOADED
      }
    )
  })
  it('should handle CARD_LOADED', () => {
    expect(
      reducer({
        items: [{id: 2}], loaded: 1, toBeLoaded: 2
      }, {
        type: types.CARD_LOADED,
        payload: {
          card: {
            id: 3
          }
        }
      })
    ).toEqual(
      {
        items: [{id: 2}, {id: 3}],
        loaded: 2,
        toBeLoaded: 2
      }
    )
  })
  it('should handle TOGGLE_EXPAND_CARD', () => {
    expect(
      reducer({
        items: [{id: 2, expanded: false}, {id: 3, expanded: false}]
      }, {
        type: types.TOGGLE_EXPAND_CARD,
        payload: {
          id: 3
        }
      })
    ).toEqual(
      {
        items: [{id: 2, expanded: false}, {id: 3, expanded: true}]
      }
    )
  })
  it('should handle ADD_TO_CART', () => {
    expect(
      reducer({
        totalPrice: 10,
        items: [
          {
            id: 3, 
            orderedCount: 0, 
            mutations: [
              {
                id: 'mut_1',
                orderedCount: 0,
                price: 30
              },
              {
                id: 'mut_2',
                orderedCount: 0,
                price: 10
              }
            ]
          }
        ]
      }, {
        type: types.ADD_TO_CART,
        payload: {
          card: {
            id: 3
          },
          mutation: {
            id: 'mut_1',
            price: 30
          }
        }
      })
    ).toEqual(
      {
        totalPrice: 40,
        items: [
          {
            id: 3, 
            orderedCount: 1, 
            mutations: [
              {
                id: 'mut_1',
                orderedCount: 1,
                price: 30
              },
              {
                id: 'mut_2',
                orderedCount: 0,
                price: 10
              }
            ]
          }
        ]
      }
    )
  })
  it('should handle REMOVE_FROM_CART', () => {
    expect(
      reducer(      {
        totalPrice: 40,
        items: [
          {
            id: 3, 
            orderedCount: 1, 
            mutations: [
              {
                id: 'mut_1',
                orderedCount: 1,
                price: 30
              },
              {
                id: 'mut_2',
                orderedCount: 0,
                price: 10
              }
            ]
          }
        ]
      }, {
        type: types.REMOVE_FROM_CART,
        payload: {
          card: {
            id: 3
          },
          mutation: {
            id: 'mut_1',
            price: 30
          }
        }
      })
    ).toEqual(
      {
        totalPrice: 10,
        items: [
          {
            id: 3, 
            orderedCount: 0, 
            mutations: [
              {
                id: 'mut_1',
                orderedCount: 0,
                price: 30
              },
              {
                id: 'mut_2',
                orderedCount: 0,
                price: 10
              }
            ]
          }
        ]
      }
    )
  })
})