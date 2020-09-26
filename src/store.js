import { createStore, applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers'
import thunk from 'redux-thunk'

const composerEnhancer = composeWithDevTools({
    name: `Redux`,
    realtime: true,
    trace: true,
    traceLimit: 25
})

export default createStore(
    rootReducer,
    composerEnhancer(applyMiddleware(thunk)),
)
