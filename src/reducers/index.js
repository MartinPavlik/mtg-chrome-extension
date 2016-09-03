import {combineReducers} from 'redux'

import state from './StateReducer'
import cards from './CardReducer'

export default combineReducers({
   state,
   cards
})