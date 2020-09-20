import produce from 'immer'
import * as React from 'react'
import { connect } from 'react-redux'
import { sum, map, defaultTo } from 'lodash/fp'

class HistStats extends React.Component {
    state = {
        chars: this.props.chars,
        hundredths: 0,
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
        const { chars, pos } = this.props
        if (prevProps.chars === 0 && chars === 1) {
            // if we are started typing a new text
            // first character typed => counter starts
            this.startTimer()
            this.setState({
                chars,
                finished: false,
            })
        } else if (
            prevProps.chars !== prevProps.text[pos].length - 1 &&
            chars === 0
        ) {
            // if we skipped text (pressed tab)
            this.stopTimer()
            this.setState({
                chars,
                finished: true,
            })
        } else if (
            prevProps.chars === prevProps.text[pos].length - 1 &&
            chars === 0
        ) {


            this.stopTimer()
            const { chars, hundredths } = this.state
            const sec = hundredths / 100
            const wpm = parseInt(
                (sec === 0 ? 0 : chars / 5 / (sec / 60)).toFixed(0),
            )
            const { errorPercent } = this.props

            let histArray = this.state.history
            histArray.push({ wpm: wpm, errors: 100 - errorPercent })

            this.setState({
                chars: prevProps.chars,
                history: histArray,
            })
        } else {
            this.setState({ chars })
        }
    }

    render() {
        const histLen = this.state.history.length
        const wpms = map('wpm', this.state.history)
        const errors = map('errors', this.state.history)
        const avgWpm = defaultTo(0)(sum(wpms) / histLen)
        const avgErrors = defaultTo(0)(sum(errors) / histLen)
        return (
            <div style={{ color: '#A0A0A0' }}>
                {histLen > 0 ? ' ' + avgWpm.toFixed(0) + ' wpm and ' : ''}
                {histLen > 0
                    ? ' ' +
                      avgErrors.toFixed(1).replace(/[.,]00$/, '') +
                      '% accuarcy '
                    : ''}
                {histLen > 0 ? ' on average over ' + histLen + ' samples' : ''}
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

export default connect(matchStateToProps)(HistStats)
