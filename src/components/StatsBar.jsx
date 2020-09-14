import produce from 'immer'
import * as React from 'react'
import { connect } from 'react-redux'

class StatsBar extends React.Component {
  state = {
    chars: this.props.chars,
    hundredths: 0,
    wpm: 0,
    errors: "100",
    timer: null,
    finished: false,
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
      produce(this.state, (draft) => {
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
    const { chars } = this.props
    if (prevProps.chars === 0 && chars === 1) {
      // if we are starting typing a new text
      this.startTimer()
      this.setState({
        chars,
        finished: false,
      })
    } else if (prevProps.chars !== 0 && chars === 0) {
      // if we finished a text
      this.stopTimer()
      const { chars, hundredths } = this.state
      const sec = hundredths / 100
      const wpm = parseInt((sec === 0 ? 0 : chars / 5 / (sec / 60)).toFixed(0))
      const { errorPercent } = this.props

      let histArray = this.state.history
      histArray.push({wpm: wpm, errors: (100 - errorPercent)})

      this.setState({
        chars: prevProps.chars,
        finished: true,
        wpm: wpm,
        errors: (100 - errorPercent).toFixed(1).replace(/[.,]0$/, ""),
        history: histArray
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
        accuarcy = <span style={
          err > 96 ? { color:'green' } :
          (err > 93 ? { color:'yellow' } : { color:'red' }) }>{ this.state.errors}% accuarcy</span>

    } else {
        wpmspan = <span>&nbsp;</span>
        accuarcy = <span>&nbsp;</span>
    }

        return (
      <div>
        {wpmspan}
        {accuarcy}
      </div>
    )
  }
}

const matchStateToProps = (state) => {
  return {
    chars: state.typingData.charsTyped,
    errorPercent: state.typingData.errorPercent,
  }
}

export default connect(matchStateToProps)(StatsBar)
