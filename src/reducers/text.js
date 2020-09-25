import * as _ from 'lodash'

import { chunk, flatten, defaultTo } from 'lodash/fp'

import { split } from 'sentence-splitter'

import Chance from 'chance'

import {
    MODE,
    NUMBERS,
    NEW_TEXT,
    RANDOM_LENGTH,
    SYMBOLS,
} from '../constants'

const chance = new Chance()

export const newKafka = () => {

    const quotes = require('../static/books/kafka.json')

    const splitter = text =>
        split(text)
            .map(x => (x.type === 'Sentence' ? x.raw : null))
            .filter(Boolean)
    const quote = splitter(quotes.join(" ").replace("  ", " "))
    const combinedQuotes = flatten(
        chunk(2, quote).map(x =>
            x.length === 2 && x[0].length + x[1].length < 120
                ? [x[0] + ' ' + x[1]]
                : x,
        ),
    )
    return {
        author: "Franz Kafka",
        context: "Metamorphosis",
        mode: MODE.QUOTE,
        text: [_.sample(combinedQuotes)],
    }
}



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
        mode: MODE.QUOTE,
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
        mode: MODE.WORDS,
        text: uniqWordSample,
    }
}

export const newWiki = playload => {
    const { author, comments } = playload
    return {
        author: _.defaultTo(author, ''),
        mode: MODE.WIKI,
        text: _.defaultTo(comments, ''),
    }
}

export const newSymbols = () => {
    const text = _.range(RANDOM_LENGTH)
        .map(() => _.sample(SYMBOLS))
        .join('')
    return {
        mode: MODE.SYMBOLS,
        text: [text],
    }
}

export const newNumbers = () => {
    const text = _.range(RANDOM_LENGTH)
        .map(() => _.sample(NUMBERS))
        .join('')
    return {
        mode: MODE.NUMBERS,
        text: [text],
    }
}

export const newCustom = words => {
    const textArr = Array.isArray(words) ? words : words.split(" ")
    const x = _.times(300, () => textArr.join(" "))
    const y = _.flatten(_.map(x, i => i.split(" ")))
    const text = _.shuffle((_.take(y, RANDOM_LENGTH))).join(" ")
    return {
        mode: MODE.CUSTOM,
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
                case MODE.QUOTE:
                    return newQuote()
                case MODE.WORDS:
                    return newWords()
                case MODE.KAFKA:
                    return newKafka()
                case MODE.WIKI:
                    return newWiki(action.payload)
                case MODE.SYMBOLS:
                    return newSymbols()
                case MODE.NUMBERS:
                    return newNumbers()
                case MODE.SETTINGS:
                    return { mode: MODE.SETTINGS }
                case MODE.CUSTOM:
                    return newCustom(action.payload.words)
                default:
                    return state
            }
        default:
            return state
    }
}
