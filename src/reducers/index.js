import { combineReducers } from 'redux'

import textData from './text'
import typingData from './typing'


const d = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export default combineReducers({
    textData,
    typingData,
    d,
})
