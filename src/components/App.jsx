import * as React from 'react'
import keydown, { ALL_KEYS } from 'react-keydown'
import { connect } from 'react-redux'
import {
    enable as enableDarkMode,
    disable as disableDarkMode,
} from 'darkreader'

import Buttons from '../components/Buttons'
import Settings from '../components/Settings'
import Stats from '../components/StatsBar'
import Typing from '../components/Typing'
import TextInfo from './TextInfo'
import { MODE } from '../constants'

if (localStorage.getItem('theme') === 'dark') {
    enableDarkMode({
        brightness: 70,
        contrast: 105,
        sepia: 15,
    })
} else {
    disableDarkMode()
}

@keydown(ALL_KEYS)
class App extends React.Component {
    render() {
        const { author, keydown, mode } = this.props

        if (mode === MODE.SETTINGS) {
            return (
                <div>
                    <Buttons />
                    <br />
                    <br />
                    <div
                        style={{
                            minHeight: 130,
                            overflow: 'hidden',
                            display: 'block',
                        }}
                    >
                        <Settings />
                    </div>
                    <br />
                    <br />
                </div>
            )
        }

        return (
            <div>
                <Buttons />
                <br />
                <Stats />
                <br />
                <div
                    style={{
                        minHeight: 130,
                        overflow: 'hidden',
                        display: 'block',
                    }}
                >
                    <Typing keydown={keydown} />
                    {author !== undefined && (
                        <div>
                            <br />
                            <TextInfo />
                        </div>
                    )}
                </div>
                <br />
                <Stats histMode={true} />
                <br />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        author: state.textData.author,
        mode: state.textData.mode,
    }
}

export default connect(mapStateToProps)(App)
