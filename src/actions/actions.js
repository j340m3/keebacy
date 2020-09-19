import { action } from 'typesafe-actions'
import axios from 'axios'
import { chunk, flatten, defaultTo } from 'lodash/fp'
import { split } from 'sentence-splitter'

import { Mode, PRINTABLE_CHARACTERS } from '../constants'

export const newText = (mode, words) => {
    return async dispatch => {
        if (mode !== Mode.wiki) {
            dispatch({ type: 'NEW_TEXT', payload: { mode, words } })
            return
        }

        const lang = defaultTo('en')(localStorage.getItem('language'))
        const wikiBaseURL = 'https://' + lang + '.wikipedia.org/w/api.php'
        const wikiURL =
            wikiBaseURL +
            '?format=json' +
            '&action=query' +
            '&generator=random' +
            '&grnnamespace=0' +
            '&prop=extracts' +
            '&exlimit=max' +
            '&explaintext&exintro'

        try {
            const wiki = await axios.get(
                `https://api.allorigins.win/get?url=${encodeURIComponent(
                    wikiURL,
                )}`,
            )

            const content = JSON.parse(wiki.data.contents)
            const firstKey = Object.keys(content.query.pages)[0]
            const { extract, title } = content.query.pages[firstKey]

            console.log(extract)

            const wikiArticle = extract
                .replace(
                    /[^a-zA-Z0-9,.\/<>?;:\'"\[\]\\|~!@#$%^&*() ÜüÄäÖö\-ß]/g,
                    '',
                )
                .replace('  ', ' ')
                .replace(/(?!\w)\.(?=\w)/g, '. ')
                .replace(/ *\([^)]*\) */g, '')

            if (wikiArticle.includes('steht für:')) return newText(mode, words)
            if (wikiArticle.includes('Vorlage:Infobox'))
                return newText(mode, words)
            if (wikiArticle === '') return newText(mode, words)

            const wikiSentences = split(wikiArticle)
                .map(x => (x.type == 'Sentence' ? x.raw : null))
                .filter(Boolean)

            const combine = text =>
                flatten(
                    chunk(2, text).map(x =>
                        x.length === 2 && x[0].length + x[1].length < 180
                            ? [x[0] + ' ' + x[1]]
                            : x,
                    ),
                )

            dispatch({
                type: 'NEW_TEXT',
                payload: {
                    mode,
                    words,
                    comments: combine(combine(combine(wikiSentences))),
                    author: title,
                },
            })
        } catch (error) {
            console.log(error)
            dispatch({ type: 'QUOTE_FAILED', payload: error })
        }
    }
}

export const changeCharsTyped = charsTyped =>
    action('CHANGE_CHARS_TYPED', { charsTyped })

export const changeErrorPercent = errorPercent =>
    action('CHANGE_ERROR_PERCENT', { errorPercent })
