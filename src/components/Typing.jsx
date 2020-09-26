import * as React from 'react'
import * as _ from 'lodash'
import { defaultTo } from 'lodash/fp'
import { connect } from 'react-redux'
import {
    changeCharsTyped,
    changeErrorPercent,
    changeTextPosition,
    newText,
} from '../actions/actions'
import { CHARACTER_SETS } from '../constants'

const TYPED_COLOR = '#A0A0A0'
const CURSOR_COLOR = '#BEBEBE'
const ERROR_COLOR = 'red'
const FONT = '"Ubuntu Mono", Courier, monospace'

class Typing extends React.Component {
    state = {
        cursorPosition: 0,
        errorPosition: undefined,
        errorSum: 0,
        textCounter: 0,
        text: '',
        block: false,
    }

    componentDidMount(prevProps) {
        this.setState({ text: this.props.text })
    }

    handleDeletion(cursorPosition, errorPosition, keydown) {
        let text = this.props.text[this.state.textCounter]
        if (cursorPosition > 0) {
            const newItems = [...this.state.text]
            newItems.splice(cursorPosition, 1)
            this.setState({ text: newItems.join('') })

            // checks to see if we can set errorPosition to undefined
            // if we backspaced over it
            const setErrorPosition = (cursorPos, errPos) => {
                this.setState({
                    cursorPosition,
                    errorPosition:
                        errPos === undefined
                            ? undefined
                            : cursorPos > errPos
                            ? errPos
                            : undefined,
                })
            }

            cursorPosition -= 1
            setErrorPosition(cursorPosition, errorPosition)

            // This is the Ctrl+Delete case
            if (keydown.event.ctrlKey) {
                while (
                    !(
                        text[cursorPosition - 1] === ' ' &&
                        text[cursorPosition] !== ' '
                    )
                ) {
                    if (cursorPosition < 1) break
                    cursorPosition -= 1
                    setErrorPosition(cursorPosition, errorPosition)
                }
            }
        }
    }

    componentDidUpdate(prevProps) {
        const {
            newText,
            mode,
            changeCharsTyped,
            changeErrorPercent,
            changeTextPosition,
        } = this.props

        if (this.props.text === undefined) return

        let text = this.props.text[this.state.textCounter]
        let { cursorPosition, errorPosition, errorSum } = this.state
        const { keydown } = prevProps

        // synchronize state with props if no error
        if (this.state.text !== text) {
            this.setState({ text: text })
        }

        const lang = defaultTo('en')(localStorage.getItem('language'))

        while (
            text &&
            text[cursorPosition] &&
            errorPosition === undefined &&
            text[cursorPosition].match(CHARACTER_SETS[lang])
        ) {
            cursorPosition += 1
            if (text[cursorPosition] === ' ') cursorPosition += 1
            changeCharsTyped(_.defaultTo(errorPosition, cursorPosition))
            this.setState({ cursorPosition: cursorPosition })
        }

        if (
            prevProps.keydown.event &&
            text !== undefined &&
            !this.state.block
        ) {
            if (
                // exclude Backspace and the like
                (keydown.event.key.length === 1
                    ? !keydown.event.key.match(CHARACTER_SETS[lang])
                    : false) ||
                keydown.event.key === 'Tab' ||
                keydown.event.key === 'Escape'
            ) {
                // if a printable character was just typed
                if (
                    errorPosition === undefined &&
                    text !== undefined &&
                    keydown.event.key !== text[cursorPosition]
                ) {
                    // set errorPosition to cursorPosition if we typed an error without
                    // any outstanding errors
                    errorPosition = cursorPosition
                    errorSum += 1
                    changeErrorPercent(100 * (errorSum / text.length))
                }

                // print every error character
                if (keydown.event.key !== text[cursorPosition]) {
                    const newItems = [...this.state.text]
                    newItems.splice(cursorPosition + 1, 0, keydown.event.key)
                    this.setState({ text: newItems.join('') })
                }

                cursorPosition += 1

                if (keydown.event.key === 'Tab') {
                    keydown.event.preventDefault()
                }

                const maxError = _.defaultTo(
                    localStorage.getItem('maxError'),
                    Number.MAX_SAFE_INTEGER,
                )

                if (errorSum > maxError || keydown.event.key === 'Escape') {
                    cursorPosition = 0
                    errorPosition = undefined
                    errorSum = 0
                    changeErrorPercent(100 * (errorSum / text.length))
                    // block typing for while after max error reached
                    if (keydown.event.key !== 'Escape') {
                        this.setState({ block: true })
                        setTimeout(() => this.setState({ block: false }), 500)
                    }
                    keydown.event.preventDefault()
                }

                // start a new session if we reach the end with no outstanding errors
                if (
                    (cursorPosition === text.length &&
                        errorPosition === undefined) ||
                    keydown.event.key === 'Tab'
                ) {
                    if (
                        this.props.text.length > this.state.textCounter + 1 &&
                        keydown.event.key !== 'Tab'
                    ) {
                        text = this.props.text[this.state.textCounter]
                        this.setState({
                            textCounter: this.state.textCounter + 1,
                        })
                        changeTextPosition(this.state.textCounter + 1)
                    } else {
                        newText(mode, this.props.text)
                        this.setState({ textCounter: 0 })
                        changeTextPosition(0)
                    }

                    cursorPosition = 0
                    errorPosition = undefined
                    errorSum = 0
                }

                if (cursorPosition === 1) {
                    changeErrorPercent(0)
                }

                // make sure the cursor doesn't go more than 1 past the length if we
                // finish a session with outstanding errors
                if (cursorPosition > text.length) {
                    cursorPosition -= 1
                }

                this.setState({ cursorPosition, errorPosition, errorSum })
            } else if (keydown.event.key === 'Backspace') {
                this.handleDeletion(cursorPosition, errorPosition, keydown)
            }
            changeCharsTyped(_.defaultTo(errorPosition, cursorPosition))
        }
    }

    render() {
        const text = this.state.text
        const { cursorPosition, errorPosition } = this.state
        if (!text) return <div />
        return (
            <div style={{ fontFamily: FONT, fontSize: '1.45em' }}>
                <mark style={{ color: TYPED_COLOR, background: '#ffffff' }}>
                    {text.slice(
                        0,
                        errorPosition === undefined
                            ? cursorPosition
                            : errorPosition,
                    )}
                </mark>
                {errorPosition !== undefined && (
                    <mark style={{ backgroundColor: ERROR_COLOR }}>
                        {text.slice(errorPosition, cursorPosition)}
                    </mark>
                )}
                <mark style={{ backgroundColor: CURSOR_COLOR }}>
                    {text[cursorPosition]}
                </mark>
                {text.slice(cursorPosition + 1, text.length)}
            </div>
        )
    }
}

const matchStateToProps = state => {
    return {
        text: state.textData.text,
        mode: state.textData.mode,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeCharsTyped: chars => {
            dispatch(changeCharsTyped(chars))
        },
        changeErrorPercent: percent => {
            dispatch(changeErrorPercent(percent))
        },
        changeTextPosition: pos => {
            dispatch(changeTextPosition(pos))
        },
        newText: (mode, words) => {
            dispatch(newText(mode, words))
            dispatch(changeCharsTyped(0))
        },
    }
}

export default connect(matchStateToProps, mapDispatchToProps)(Typing)
