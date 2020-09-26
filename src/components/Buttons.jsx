import * as React from 'react'
import { connect } from 'react-redux'
import { newText } from '../actions/actions'
import { MODE } from '../constants'
import { defaultTo } from 'lodash/fp'

class Buttons extends React.Component {
    state = {
        input: '',
        customMode: false,
        showInput: true,
    }

    handleChange = event => {
        this.setState({ input: event.target.value })
    }

    handleSubmit = event => {
        localStorage.setItem('shuffle', this.refs.shuffle.checked)
        this.props.newText(MODE.CUSTOM, this.state.input.split(' '))
        this.setState({ showInput: false })
        event.preventDefault()
    }

    renderModeButton(mode) {
        return (
            <button
                style={{ fontSize: '1.1em' }}
                onClick={() => {
                    this.setState({ customMode: false })
                    this.props.newText(mode)
                }}
            >
                {mode.toLowerCase()}
            </button>
        )
    }

    render() {
        const { input, customMode } = this.state
        return (
            <div>
                {this.renderModeButton(MODE.QUOTE)}
                {this.renderModeButton(MODE.WIKI)}
                {this.renderModeButton(MODE.WORDS)}
                <button
                    style={{ fontSize: '1.1em' }}
                    onClick={() => {
                        this.props.newText(MODE.CUSTOM, '')
                        this.setState({
                            customMode: true,
                            showInput: true,
                        })
                    }}
                >
                    {MODE.CUSTOM.toLowerCase()}
                </button>
                {this.renderModeButton(MODE.SETTINGS)}
                {customMode && this.state.showInput && (
                    <div style={{ display: 'inline', fontSize: '1.1em' }}>
                        <br />
                        <form
                            style={{ display: 'inline' }}
                            onSubmit={this.handleSubmit}
                        >
                            <br />
                            <textarea
                                rows='20'
                                cols='80'
                                type='text'
                                value={input}
                                style={{
                                    fontSize: '1.00em',
                                    display: 'inline',
                                }}
                                onChange={this.handleChange}
                            />{' '}
                            <br />
                            <input
                                type='submit'
                                value='submit'
                                style={{
                                    fontSize: '1.00em',
                                    display: 'inline',
                                }}
                            />
                            <input
                                type='checkbox'
                                defaultChecked={
                                    defaultTo(
                                        'false',
                                        localStorage.getItem('shuffle'),
                                    ) === 'true'
                                }
                                ref='shuffle'
                                id='shuffle'
                                name='shuffle'
                            />
                            <label htmlFor='shuffle'> shuffle words</label>
                        </form>
                    </div>
                )}
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
