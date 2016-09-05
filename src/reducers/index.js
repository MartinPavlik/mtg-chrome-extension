import {combineReducers} from 'redux'

import state from './StateReducer'
import cards from './CardReducer'
import { reducer as form } from 'redux-form'

export default combineReducers({
   state,
   cards,
   form
})