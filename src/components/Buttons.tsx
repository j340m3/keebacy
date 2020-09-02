import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { newText } from '../actions/actions'
import { Mode } from '../constants'

interface IButtonProps {
  newText: (mode?: string, words?: string[]) => void
}

interface IButtonState {
  input: string
  ref1: any
  ref2: any
  ref3: any
  ref4: any
  ref5: any
  ref6: any
  repeatedWordsMode: boolean
}

class Buttons extends React.Component<IButtonProps, IButtonState> {
  public readonly state: IButtonState = {
    input: '',
    ref1: React.createRef(),
    ref2: React.createRef(),
    ref3: React.createRef(),
    ref4: React.createRef(),
    ref5: React.createRef(),
    ref6: React.createRef(),
    repeatedWordsMode: false,
  }

  private handleChange = (event: any) => {
    this.setState({ input: event.target.value })
  }

  private handleSubmit = (event: any) => {
    this.props.newText(Mode.repeatedWords, this.state.input.split(' '))
    event.preventDefault()
  }

  private renderModeButton(ref: any, mode: string) {
    return (
      <button
        ref={ref}
        onClick={() => {
          this.setState({ repeatedWordsMode: false })
          this.props.newText(mode)
          ref.current.blur()
        }}
      >
        {mode}
      </button>
    )
  }

  public render() {
    const {
      input,
      ref1,
      ref2,
      ref3,
      ref4,
      ref5,
      ref6,
      repeatedWordsMode,
    } = this.state
    return (
      <div>
        {this.renderModeButton(ref1, Mode.quote)}
        {this.renderModeButton(ref2, Mode.code)}
        {this.renderModeButton(ref3, Mode.random)}
        {this.renderModeButton(ref4, Mode.symbols)}
        {this.renderModeButton(ref5, Mode.numbers)}
        <button
          ref={ref6}
          onClick={() => {
            this.setState({ repeatedWordsMode: !repeatedWordsMode })
            ref4.current.blur()
          }}
        >
          {Mode.repeatedWords}
        </button>
        {repeatedWordsMode && (
          <div style={{ display: 'inline' }}>
            {' '}
            <form style={{ display: 'inline' }} onSubmit={this.handleSubmit}>
              <input type='text' value={input} onChange={this.handleChange} />
              <input type='submit' value='Submit' />
            </form>
          </div>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    newText: (mode?: string, words?: string[]) => {
      // @ts-ignore
      dispatch(newText(mode, words))
    },
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Buttons)
