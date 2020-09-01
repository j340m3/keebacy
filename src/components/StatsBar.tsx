import produce from 'immer'
import * as React from 'react'
import { connect } from 'react-redux'

import { IStoreState } from '../store'

interface IStatsProps {
  chars: number
  errorPercent: number
}

interface IStatsState {
  timer: any
  hundredths: number
  chars: number
  finished: boolean
}

class StatsBar extends React.Component<IStatsProps, IStatsState> {
  public readonly state: IStatsState = {
    chars: this.props.chars,
    hundredths: 0,
    timer: null,
    finished: false,
  }

  private startTimer = () => {
    this.setState({
      hundredths: 0,
      timer: setInterval(this.tick, 10),
    })
  }

  private tick = () => {
    this.setState(
      produce<IStatsState>(this.state, (draft) => {
        draft.hundredths += 1
      }),
    )
  }

  private stopTimer = () => {
    clearInterval(this.state.timer)
  }

  public componentDidUpdate(prevProps: IStatsProps, prevState: IStatsState) {
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
      this.setState({
        chars: prevProps.chars,
        finished: true,
      })
    } else {
      // if we are in the middle of a text
      this.setState({
        chars,
      })
    }
  }

  public render() {
    const { chars, hundredths, finished } = this.state
    const { errorPercent } = this.props
    const sec = hundredths / 100
    const wpm = sec === 0 ? 0 : chars / 5 / (sec / 60)
    let wpmspan
    let accuarcy
    if (finished) {
        wpmspan = <span>{wpm.toFixed(0)} wpm</span>
        accuarcy = <span> {(100 - errorPercent).toFixed(1).replace(/[.,]0$/, "")}% accuarcy</span>
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

const matchStateToProps = (state: IStoreState) => {
  return {
    chars: state.typingData.charsTyped,
    errorPercent: state.typingData.errorPercent,
  }
}

export default connect(matchStateToProps)(StatsBar)
