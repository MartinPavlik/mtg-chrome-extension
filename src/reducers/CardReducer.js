import { NOT_LOADED, LOADING, LOADED } from '../constants/LoadingStatus'
import { NOT_ORDERED, ORDERING, ORDERED } from '../constants/OrderingStatus'
import {
  LOAD_CARDS_REQUEST,
  LOAD_CARDS_DONE,
  CARD_LOADED,
  TOGGLE_EXPAND_CARD,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  ORDER_CARDS_REQUEST,
  ORDER_CARDS_DONE
} from '../actions/CardActions'

const defaultState = {
  items: [],
  text: '', // todo -> form
  totalPrice: 0,
  toBeLoaded: 0,
  loaded: 0,
  loadingStatus: NOT_LOADED,
  orderingStatus: NOT_ORDERED
}

function reduceMutation(mutation, action) {
  switch(action.type) {
    case ADD_TO_CART:
      return Object.assign({}, mutation, {
        orderedCount: mutation.orderedCount + 1
      })
    case REMOVE_FROM_CART:
      return Object.assign({}, mutation, {
        orderedCount: mutation.orderedCount - 1
      })
    default:
      return mutation
  }
}

function reduceCard(card, action) {
  switch(action.type) {
    case ADD_TO_CART:
      return Object.assign({}, card, {
          orderedCount: card.orderedCount + 1,
          mutations: card.mutations.map( adept => {
            if(adept.id == action.mutation.id) {
              return reduceMutation(adept, action)
            }
            return adept;
          })
        }
      )
    case REMOVE_FROM_CART:
      return Object.assign({}, card, {
          orderedCount: card.orderedCount - 1,
          mutations: card.mutations.map( adept => {
            if(adept.id == action.mutation.id) {
              return reduceMutation(adept, action)
            }
            return adept;
          })
        }
      )
    default:
      return card
  }
}

export default function (state = defaultState, action) {
  switch(action.type) {
    case LOAD_CARDS_REQUEST:
      return Object.assign({}, state, {
        loadingStatus: LOADING,
        toBeLoaded: action.toBeLoaded,
        loaded: 0
      })
    case LOAD_CARDS_DONE:
      return Object.assign({}, state, {
        loadingStatus: LOADED
      })
    case CARD_LOADED:
      return Object.assign({}, state, {
        items: state.items.concat([action.card]),
        loaded: state.loaded + 1
      })
    case ORDER_CARDS_REQUEST:
      return Object.assign({}, state, {
        orderingStatus: ORDERING
      })
    case ORDER_CARDS_DONE:
      return Object.assign({}, state, {
        orderingStatus: ORDERED
      })
    case TOGGLE_EXPAND_CARD:
      var { id } = action;
      const nextItems = state.items.map( adept => {
        if(id == adept.id) {
          adept = Object.assign({}, adept, {
            expanded: !adept.expanded
          });
        }
        return adept;
      });
      return Object.assign({}, state, {
        items: nextItems
      })
    case ADD_TO_CART:
      var { card, mutation } = action;
      return Object.assign({}, state, {
        totalPrice: state.totalPrice + mutation.price,
        items: state.items.map( adept => {
          if(card.id == adept.id) {
            return reduceCard(adept, action)
          }
          return adept;
        })
      })
    case REMOVE_FROM_CART:
      var { card, mutation } = action;
      return Object.assign({}, state, {
        totalPrice: state.totalPrice - mutation.price,
        items: state.items.map( adept => {
          if(card.id == adept.id) {
            return reduceCard(adept, action)
          }
          return adept;
        })
      })
    default:
      return state
  }
}