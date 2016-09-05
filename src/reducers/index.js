import {combineReducers} from 'redux'

import cards from './CardReducer'
import { reducer as form } from 'redux-form'

export default combineReducers({
   cards,
   form
})