import produce from 'immer'
import * as React from 'react'
import { connect } from 'react-redux'
import { sum, map, defaultTo } from 'lodash/fp'

class StatsBar extends React.Component {
    state = {
        chars: this.props.chars,
        hundredths: 0,
        wpm: 0,
        errors: '100',
        timer: null,
        history: [],
    }

    startTimer = () => {
        this.setState({
            hundredths: 0,
            timer: setInterval(this.tick, 10),
        })
    }

    tick = () => {
        this.setState(
            produce(this.state, draft => {
                draft.hundredths += 1
            }),
        )
    }

    stopTimer = () => {
        clearInterval(this.state.timer)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props === prevProps) {
            return
        }
        const { chars, pos, text } = this.props

        if (
            Number.isFinite(prevProps.pos) &&
            prevProps.text[prevProps.pos] !== undefined &&
            // previously have reached the end of the text
            prevProps.chars === prevProps.text[prevProps.pos].length - 1 &&
            // and we are at the beginning of a
            chars === 0 &&
            // new text
            prevProps.text[prevProps.pos] !== text[pos]
        ) {
            const { hundredths } = this.state
            const sec = hundredths / 100
            const wpm = parseInt(
                (sec === 0 ? 0 : prevProps.chars / 5 / (sec / 60)).toFixed(0),
            )
            const { errorPercent } = this.props

            let histArray = this.state.history
            histArray.push({ wpm: wpm, errors: 100 - errorPercent })

            this.setState({
                chars: prevProps.chars,
                wpm: wpm,
                errors: (100 - errorPercent).toFixed(1).replace(/[.,]0$/, ''),
                history: histArray,
            })
        }

        if (prevProps.chars === 0 && chars === 1) {
            // if we are started typing a new text
            // first character typed => counter starts
            this.stopTimer()
            this.startTimer()
            this.setState({
                chars,
            })
        } else if (
            prevProps.text[pos] !== undefined &&
            prevProps.chars !== prevProps.text[pos].length - 1 &&
            chars === 0
        ) {
            // if we skipped text (pressed tab)
            this.stopTimer()
            this.setState({ chars })
        } else {
            // if we are in the middle of a text
            this.setState({ chars })
        }
    }

    render() {
        let wpmspan
        let accuarcy

        const err = parseInt(this.state.errors)

        const histLen = this.state.history.length
        const wpms = map('wpm', this.state.history)
        const errors = map('errors', this.state.history)
        const avgWpm = defaultTo(0)(sum(wpms) / histLen)
        const avgErrors = defaultTo(0)(sum(errors) / histLen)
        const show = histLen > 0

        if (this.state.wpm !== 0) {
            wpmspan = <span>{this.state.wpm} wpm&nbsp;</span>
            accuarcy = (
                <span
                    style={
                        err > 96
                            ? { color: 'green' }
                            : err > 93
                                ? { color: '#E1AD01' }
                                : { color: 'red' }
                    }
                >
                    {this.state.errors}% accuarcy
                </span>
            )
        } else {
            wpmspan = <span>&nbsp;</span>
            accuarcy = <span>&nbsp;</span>
        }

        if (this.props.histMode) {
            return (
                <div style={{ color: '#A0A0A0', fontSize: '1.2em' }}>
                    <div
                        style={
                            show
                                ? {
                                      borderTop: '1px solid #A0A0A0',
                                      padding: 3,
                                      width: 450,
                                  }
                                : {}
                        }
                    />
                    {show ? ' ' + avgWpm.toFixed(0) + ' wpm and ' : ''}
                    {show
                        ? ' ' +
                          avgErrors.toFixed(1).replace(/[.,]00$/, '') +
                          '% accuarcy '
                        : ''}
                    {show ? ' on average over ' + histLen + ' samples' : ''}
                </div>
            )
        }

        return (
            <div style={{ fontSize: '1.2em' }}>
                {wpmspan}
                {accuarcy}
            </div>
        )
    }
}

const matchStateToProps = state => {
    return {
        chars: state.typingData.charsTyped,
        text: state.textData.text,
        pos: state.typingData.textPosition,
        errorPercent: state.typingData.errorPercent,
    }
}

export default connect(matchStateToProps)(StatsBar)
