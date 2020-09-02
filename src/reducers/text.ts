import * as _ from 'lodash'

import { Action, ActionName } from '../actions'
import {
  Mode,
  NUMBERS,
  PRINTABLE_CHARACTERS,
  RANDOM_LENGTH,
  SYMBOLS,
} from '../constants'
import quotes from '../static/quotes.json'
import { ITextData } from '../store'

export const newQuote = (): ITextData => {

  let quote =_.sample(quotes)!
  while (quote.text.length > 100) {
    quote = _.sample(quotes)!
  }

  const { author, context, text } = quote

  console.log(text.length)
  return {
    author,
    context,
    mode: Mode.quote,
    text,
  }
}

export const newCode = (): ITextData => {
  return {
    author: undefined,
    context: undefined,
    mode: Mode.code,
    text: 'hello', // TODO
  }
}

export const newRandom = (): ITextData => {
  const text = _.range(RANDOM_LENGTH)
    .map(() => _.sample(PRINTABLE_CHARACTERS))
    .join('')
  return {
    author: undefined,
    context: undefined,
    mode: Mode.random,
    text,
  }
}

export const newSymbols = (): ITextData => {
  const text = _.range(RANDOM_LENGTH)
    .map(() => _.sample(SYMBOLS))
    .join('')
  return {
    author: undefined,
    context: undefined,
    mode: Mode.symbols,
    text,
  }
}

export const newNumbers = (): ITextData => {
  const text = _.range(RANDOM_LENGTH)
    .map(() => _.sample(NUMBERS))
    .join('')
  return {
    author: undefined,
    context: undefined,
    mode: Mode.numbers,
    text,
  }
}

export const newRepeated = (words?: string[]): ITextData => {
  const text = _.range(RANDOM_LENGTH)
    .map(() => _.sample(words))
    .join(' ')
  return {
    author: undefined,
    context: undefined,
    mode: Mode.repeatedWords,
    text,
  }
}

export default (state: ITextData = newQuote(), action: Action): ITextData => {
  switch (action.type) {
      // @ts-ignore
    case ActionName.newText:
      const mode =
               // @ts-ignore
        action.payload.mode === undefined ? state.mode : action.payload.mode
      switch (mode) {
        case Mode.quote:
          console.log("mode quote")
          return newQuote()
        case Mode.code:
               // @ts-ignore
          console.log("mode code")
          return {
              author: undefined,
              context: undefined,
              mode: Mode.repeatedWords,
               // @ts-ignore
              text: action.payload.words ? action.payload.words[0] : ""
            }
        case Mode.random:
          return newRandom()
        case Mode.symbols:
          return newSymbols()
        case Mode.numbers:
          return newNumbers()
        case Mode.repeatedWords:
               // @ts-ignore
          return newRepeated(action.payload.words)
        default:
          return state
      }
    default:
      return state
  }
}
