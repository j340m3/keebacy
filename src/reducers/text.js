import * as _ from 'lodash'
import { chunk, defaultTo, flatten, shuffle, pipe, map } from 'lodash/fp'
import { split } from 'sentence-splitter'
import Chance from 'chance'
import { MODE, NUMBERS, NEW_TEXT, RANDOM_LENGTH, SYMBOLS } from '../constants'

const chance = new Chance()

const getSampleLength = () => {
    switch (localStorage.getItem('sampleLength')) {
        case 'short':
            return 20
        case 'medium':
            return 50
        case 'long':
            return 150
        default:
            return 20
    }
}

const splitter = text =>
    split(text)
        .map(x => (x.type === 'Sentence' ? x.raw : null))
        .filter(Boolean)

const recombine = len => text =>
    flatten(
        chunk(2, text).map(x =>
            x.length === 2 && x[0].length + x[1].length < len
                ? [x[0] + ' ' + x[1]]
                : x,
        ),
    )

export const newKafka = () => {
    const quotes = require('../static/books/kafka.json')
    const quote = splitter(quotes.join(' ').replace('  ', ' '))
    const combinedQuotes = recombine(120)(quote)
    return {
        author: 'Franz Kafka',
        context: 'Metamorphosis',
        mode: MODE.QUOTE,
        text: [_.sample(combinedQuotes)],
    }
}

export const newQuote = () => {
    const lang = defaultTo('en')(localStorage.getItem('language'))
    const quotes = require('../static/quotes/lang_' + lang + '.json')

    const { author, context, text } = _.sample(quotes)

    if (localStorage.getItem('sampleLength') === 'long') {
        return {
            author,
            context,
            mode: MODE.QUOTE,
            text: [text],
        }
    }

    const getSampleLength = () => {
        switch (localStorage.getItem('sampleLength')) {
            case 'short':
                return 120
            case 'medium':
                return 220
            default:
                return 120
        }
    }

    const combinedQuotes = recombine(getSampleLength())(
        recombine(getSampleLength())(splitter(text)),
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

    const sampleLength = getSampleLength()
    const uniqWordSample = [
        _.take(
            _.uniq(_.times(sampleLength * 1.5, getWeightedRandomWord)),
            sampleLength,
        ).join(' '),
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

    const formatInput = input => {
        const wordArr = Array.isArray(input) ? input : input.split(' ')
        const repeatIsSet = defaultTo('false', localStorage.getItem('repeat'))

        if (wordArr.length < 300 && repeatIsSet === 'true') {
            return (wordArr.join(' ') + " ").repeat(10).split(' ')
        }
        return wordArr
    }

    const textArr = formatInput(words)
    const shuffleIsSet = defaultTo('false', localStorage.getItem('shuffle'))

    if (shuffleIsSet === 'false') {
        const getSentenceLength = () => {
            switch (localStorage.getItem('sampleLength')) {
                case 'short':
                    return 120
                case 'medium':
                    return 450
                case 'long':
                    return 1200
                default:
                    return 120
            }
        }

        const chunkTextArray = pipe(
            splitter,
            recombine(getSentenceLength()),
            recombine(getSentenceLength()),
            recombine(getSentenceLength()),
            map(x => chunk(getSampleLength(), x.split(' '))),
            flatten,
            map(x => x.join(' ')),
        )(textArr.join(' '))

        return {
            mode: MODE.CUSTOM,
            text: chunkTextArray,
        }
    }

    const text = pipe(
        map(i => i.split(' ')),
        flatten,
        shuffle,
        chunk(getSampleLength()),
        map(i => i.join(' ')),
        map(i => i.replace(/ +(?= )/g,'')),
    )(textArr)

    return {
        mode: MODE.CUSTOM,
        text: text,
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
