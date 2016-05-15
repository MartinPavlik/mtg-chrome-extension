import {parseImport, loadCards} from '../utils/scraper.cernyRytir'

export const LOAD_CARDS_REQUEST = 'LOAD_CARDS_REQUEST';
export const LOAD_CARDS_DONE = 'LOAD_CARDS_DONE';

export const CARD_LOADED = 'CARD_LOADED';

export const ORDER_CARDS_REQUEST = 'ORDER_CARDS_REQUEST';
export const ORDER_CARDS_DONE = 'ORDER_CARDS_DONE';

export const USE_CHEAPEST = 'USE_CHEAPEST';

export const TOGGLE_EXPAND_CARD = 'CARD_EXPAND';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

export function loadCardsRequest(cardListString) {
  return (dispatch, getState) => {
    const queue = parseImport(cardListString);

    dispatch({
      type: LOAD_CARDS_REQUEST,
      toBeLoaded: queue.length
    })

    loadCards(queue, function(card){
      const newItem = Object.assign({}, card, {
        id: Date.now()
      });

      dispatch(cardLoaded(newItem));

      const { loaded, toBeLoaded } = getState()['cards'];

      if(loaded == toBeLoaded) {
        dispatch(loadCardsDone());
      }
    })
  }
}

export function loadCardsDone() {
  return {
    type: LOAD_CARDS_DONE
  }
}

export function cardLoaded(card) {
  return {
    type: CARD_LOADED,
    card
  }
}

export function orderCardsRequest() {
  // todo
}

export function orderCardsDone() {
  return {
    type: ORDER_CARDS_DONE
  }
}

export function useCheapest() {

}

export function toggleCardExpand(id) {
  return {
    type: TOGGLE_EXPAND_CARD,
    id
  }
}

export function addToCart(mutation, card) {
  return {
    type: ADD_TO_CART,
    card,
    mutation
  }
}

export function removeFromCart(mutation, card) {
  return {
    type: REMOVE_FROM_CART,
    card,
    mutation
  }
}