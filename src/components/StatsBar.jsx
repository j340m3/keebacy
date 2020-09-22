import produce from 'immer'
import * as React from 'react'
import { connect } from 'react-redux'

class StatsBar extends React.Component {
    state = {
        chars: this.props.chars,
        hundredths: 0,
        wpm: 0,
        errors: '100',
        timer: null,
        finished: false,
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

        if (
            Number.isFinite(prevProps.pos) &&
            prevProps.chars === prevProps.text[prevProps.pos].length - 1 &&
            chars === 0
        ) {
            // if we finished a text
            this.stopTimer()
            const { chars, hundredths } = this.state
            const sec = hundredths / 100
            const wpm = parseInt(
                (sec === 0 ? 0 : chars / 5 / (sec / 60)).toFixed(0),
            )
            const { errorPercent } = this.props

            this.setState({
                chars: prevProps.chars,
                finished: true,
                wpm: wpm,
                errors: (100 - errorPercent).toFixed(1).replace(/[.,]0$/, ''),
            })
            return
        }

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
        } else {
            // if we are in the middle of a text
            this.setState({
                chars,
            })
        }
    }

    render() {
        let wpmspan
        let accuarcy

        const err = parseInt(this.state.errors)
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
