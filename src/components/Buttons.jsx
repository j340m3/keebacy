import * as React from 'react'
import { connect } from 'react-redux'
import { newText } from '../actions/actions'
import { MODE } from '../constants'

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
        customMode: false,
    }

    handleChange = event => {
        this.setState({ input: event.target.value })
    }

    handleSubmit = event => {
        this.props.newText(MODE.CUSTOM, this.state.input.split(' '))
        event.preventDefault()
    }

    renderModeButton(ref, mode) {
        return (
            <button
                style={{ fontSize: '1.1em' }}
                ref={ref}
                onClick={() => {
                    this.setState({ customMode: false })
                    this.props.newText(mode)
                    ref.current.blur()
                }}
            >
                {mode.toLowerCase()}
            </button>
        )
    }

    render() {
        const { input, ref1, ref2, ref6, ref7, ref8, customMode } = this.state
        return (
            <div>
                {this.renderModeButton(ref1, MODE.QUOTE)}
                {this.renderModeButton(ref2, MODE.WIKI)}
                {this.renderModeButton(ref7, MODE.WORDS)}
                <button
                    style={{ fontSize: '1.1em' }}
                    ref={ref6}
                    onClick={() => {
                        this.setState({ customMode: !customMode })
                        ref6.current.blur()
                    }}
                >
                    {MODE.CUSTOM.toLowerCase()}
                </button>
                {customMode && (
                    <div style={{ display: 'inline', fontSize: '1.1em' }}>
                        {' '}
                        <form
                            style={{ display: 'inline' }}
                            onSubmit={this.handleSubmit}
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={this.handleChange}
                            />
                            <input
                                type="submit"
                                value="submit"
                                style={{
                                    fontSize: '1.00em',
                                    display: 'inline',
                                }}
                            />
                        </form>
                    </div>
                )}
                {this.renderModeButton(ref8, MODE.SETTINGS)}
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

export default connect(
    null,
    mapDispatchToProps,
)(Buttons)
