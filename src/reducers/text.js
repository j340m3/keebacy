import * as _ from 'lodash'

import { chunk, flatten, defaultTo } from 'lodash/fp'

import { split } from 'sentence-splitter'

import Chance from 'chance'

import {
    Mode,
    NUMBERS,
    NEW_TEXT,
    PRINTABLE_CHARACTERS,
    RANDOM_LENGTH,
    SYMBOLS,
} from '../constants'

const chance = new Chance()

export const newQuote = () => {

    const lang = defaultTo('en')(localStorage.getItem('language'))
    const quotes = require('../static/quotes/lang_' + lang + '.json')

    const { author, context, text } = _.sample(quotes)

    const splitter = text =>
        split(text)
            .map(x => (x.type === 'Sentence' ? x.raw : null))
            .filter(Boolean)
    const quote = splitter(text)
    const combinedQuotes = flatten(
        chunk(2, quote).map(x =>
            x.length === 2 && x[0].length + x[1].length < 120
                ? [x[0] + ' ' + x[1]]
                : x,
        ),
    )
    return {
        author,
        context,
        mode: Mode.quote,
        text: combinedQuotes,
    }
}

export const newWords = () => {
    const lang = defaultTo('en')(localStorage.getItem('language'))
    const words = require('../static/words/' + lang + '.json')
    const wordList = words.words.slice(0, 2800)
    // Uses the New General Service List (NGSL) which covers 90% of general
    // written english texts. The first 200 words (covering more than 50%) are
    // weighted much higher than the remaining 2600 words.
    const getWeightedRandomWord = () =>
        chance.weighted(
            wordList,
            _.fill(Array(200), 100).concat(
                _.fill(Array(wordList.length - 200), 1),
            ),
        )

    const uniqWordSample = [
        _.take(_.uniq(_.times(30, getWeightedRandomWord)), 20).join(' '),
    ]

    return {
        mode: Mode.words,
        text: uniqWordSample,
    }
}

export const newWiki = playload => {
    const { author, comments } = playload
    return {
        author: _.defaultTo(author, ''),
        mode: Mode.wiki,
        text: _.defaultTo(comments, ''),
    }
}

export const newRandom = () => {
    const text = _.range(RANDOM_LENGTH)
        .map(() => _.sample(PRINTABLE_CHARACTERS))
        .join('')
    return {
        mode: Mode.random,
        text: [text],
    }
}

export const newSymbols = () => {
    const text = _.range(RANDOM_LENGTH)
        .map(() => _.sample(SYMBOLS))
        .join('')
    return {
        mode: Mode.symbols,
        text: [text],
    }
}

export const newNumbers = () => {
    const text = _.range(RANDOM_LENGTH)
        .map(() => _.sample(NUMBERS))
        .join('')
    return {
        mode: Mode.numbers,
        text: [text],
    }
}

export const newRepeated = words => {
    const text = _.range(RANDOM_LENGTH)
        .map(() => _.sample(words))
        .join(' ')
    return {
        mode: Mode.repeatedWords,
        text: [text],
    }
}

export default (state = newQuote(), action) => {
    switch (action.type) {
        case NEW_TEXT:
            const mode =
                action.payload.mode === undefined
                    ? state.mode
                    : action.payload.mode
            switch (mode) {
                case Mode.quote:
                    return newQuote()
                case Mode.words:
                    return newWords()
                case Mode.wiki:
                    return newWiki(action.payload)
                case Mode.random:
                    return newRandom()
                case Mode.symbols:
                    return newSymbols()
                case Mode.numbers:
                    return newNumbers()
                case Mode.settings:
                    return { mode: Mode.settings }
                case Mode.repeatedWords:
                    return newRepeated(action.payload.words)
                default:
                    return state
            }
        default:
            return state
    }
}
