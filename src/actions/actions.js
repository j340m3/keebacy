import { action } from 'typesafe-actions'
import axios from 'axios'
import { chunk, flatten, defaultTo, sample } from 'lodash/fp'
import { split } from 'sentence-splitter'
import { MODE, EXCLUSION_KEYWORDS, NEW_TEXT } from '../constants'

const getRandomWikiArticle = async () => {
    const lang = defaultTo('en')(localStorage.getItem('language'))
    const wikiLang = lang === 'en' ? sample(['en', 'simple']) : lang
    const wikiBaseURL = 'https://' + wikiLang + '.wikipedia.org/w/api.php'
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

    const wiki = await axios.get(wikiURL)

    const firstKey = Object.keys(wiki.data.query.pages)[0]
    const { extract, title } = wiki.data.query.pages[firstKey]

    const wikiArticle = extract
        .replace('  ', ' ')
        .replace('–', '-')
        .replace('—', '-')
        .replace('„', '"')
        .replace('“', '"')
        .replace(/(?!\w)\.(?=\w)/g, '. ')

    // check if we have an acutal article or just a list of possible articles
    if (
        EXCLUSION_KEYWORDS.some(
            e => wikiArticle.includes(e) || title.includes(e),
        )
    ) {
        return await getRandomWikiArticle()
    }

    return { wikiArticle, title }
}

export const newText = (mode, words) => {
    return async dispatch => {
        if (mode !== MODE.WIKI) {
            dispatch({ type: NEW_TEXT, payload: { mode, words } })
            return
        }

        try {
            const { wikiArticle, title } = await getRandomWikiArticle()
            const wikiSentences = split(wikiArticle)
                .map(x => (x.type === 'Sentence' ? x.raw : null))
                .filter(Boolean)

            const getSampleLength = () => {
                switch (localStorage.getItem('sampleLength')) {
                    case 'short':
                        return 180
                    case 'medium':
                        return 450
                    case 'long':
                        return 1200
                    default:
                        return 18
                }
            }

            const combine = text =>
                flatten(
                    chunk(2, text).map(x =>
                        x.length === 2 &&
                        x[0].length + x[1].length < getSampleLength()
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
