import { combineReducers } from 'redux'

import textData from './text'
import typingData from './typing'

export default combineReducers({
  textData,
  typingData,
})
