import { action } from 'typesafe-actions'
import axios from 'axios'
import { chunk, flatten, defaultTo } from 'lodash/fp'
import { split } from 'sentence-splitter'

import { Mode, PRINTABLE_CHARACTERS } from '../constants'


const getRandomWikiArticle = async () => {

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
            '&explaintext&exintro' +
            '&origin=*'

            const wiki = await axios.get( wikiURL)

            const firstKey = Object.keys(wiki.data.query.pages)[0]
            const { extract, title } = wiki.data.query.pages[firstKey]

            console.log(extract)

            const wikiArticle = extract
                .replace('  ', ' ')
                .replace(/(?!\w)\.(?=\w)/g, '. ')

            const exclusionKeywords = [
                'bezeichnet:',
                'steht für:',
                'folgender Personen:',
                'verschiedener Personen:',
                'folgender Orte:',
                'verschiedener Orte:',
                'Vorlage:Infobox',
            ]

            // check if we have an acutal article or just a list of possible articles
            if (exclusionKeywords.some(e => wikiArticle.includes(e))) {
                return await getRandomWikiArticle()
            }

             return { wikiArticle, title }

}

export const newText = (mode, words) => {
    return async dispatch => {

        if (mode !== Mode.wiki) {
            dispatch({ type: 'NEW_TEXT', payload: { mode, words } })
            return
        }

        try {
            const { wikiArticle, title } = await getRandomWikiArticle()
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

export const changeTextPosition = textPosition =>
    action('CHANGE_TEXT_POSITION', { textPosition })

export const changeCharsTyped = charsTyped =>
    action('CHANGE_CHARS_TYPED', { charsTyped })

export const changeErrorPercent = errorPercent =>
    action('CHANGE_ERROR_PERCENT', { errorPercent })
