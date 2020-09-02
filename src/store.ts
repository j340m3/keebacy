import { createStore, applyMiddleware } from 'redux'



import thunk from 'redux-thunk'

import rootReducer from './reducers'

export interface ITextData {
  mode: string
  text: string
  author?: string
  context?: string
}

export interface ITypingData {
  charsTyped: number
  errorPercent: number
}

export interface IStoreState {
  textData: ITextData
  typingData: ITypingData
}

export default createStore<IStoreState, any, any, any>(rootReducer, applyMiddleware(thunk))
