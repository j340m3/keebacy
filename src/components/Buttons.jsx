import * as React from 'react'
import { connect } from 'react-redux'
import { newText } from '../actions/actions'
import { Mode } from '../constants'

class Buttons extends React.Component {
    state = {
        input: '',
        ref1: React.createRef(),
        ref2: React.createRef(),
        ref3: React.createRef(),
        ref4: React.createRef(),
        ref5: React.createRef(),
        ref6: React.createRef(),
        ref7: React.createRef(),
        ref8: React.createRef(),
        ref9: React.createRef(),
        repeatedWordsMode: false,
    }

    handleChange = event => {
        this.setState({ input: event.target.value })
    }

    handleSubmit = event => {
        this.props.newText(Mode.repeatedWords, this.state.input.split(' '))
        event.preventDefault()
    }

    renderModeButton(ref, mode) {
        return (
            <button
                style={{ fontSize: "1.1em" }}
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

    render() {
        const {
            input,
            ref1,
            ref2,
            ref4,
            ref6,
            ref7,
            ref8,
            repeatedWordsMode,
        } = this.state
        return (
            <div>
                {this.renderModeButton(ref1, Mode.quote)}
                {this.renderModeButton(ref2, Mode.wiki)}
                {this.renderModeButton(ref7, Mode.words)}
                <button
                    style={{ fontSize: "1.1em" }}
                    ref={ref6}
                    onClick={() => {
                        this.setState({ repeatedWordsMode: !repeatedWordsMode })
                        ref4.current.blur()
                    }}
                >
                    {Mode.repeatedWords}
                </button>
                {repeatedWordsMode && (
                    <div style={{ display: 'inline', fontSize: "1.1em" }}>
                        {' '}
                        <form
                            style={{ display: 'inline' }}
                            onSubmit={this.handleSubmit}
                        >
                            <input
                                type='text'
                                value={input}
                                onChange={this.handleChange}
                            />
                            <input type='submit' value='Submit' />
                        </form>
                    </div>
                )}
                {this.renderModeButton(ref8, Mode.settings)}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        newText: (mode, words) => {
            dispatch(newText(mode, words))
        },
    }
}

export default connect(null, mapDispatchToProps)(Buttons)
