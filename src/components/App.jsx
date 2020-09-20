import * as React from 'react'
import keydown, { ALL_KEYS } from 'react-keydown'
import { connect } from 'react-redux'

import Buttons from '../components/Buttons'
import Settings from '../components/Settings'
import Stats from '../components/StatsBar'
import Hist from '../components/HistStats'
import Typing from '../components/Typing'
import TextInfo from './TextInfo'
import { Mode } from '../constants'

const M = window.M;

@keydown(ALL_KEYS)
class App extends React.Component {
    render() {
        // tslint:disable-next-line:no-shadowed-variable
        const { author, keydown, mode } = this.props
        return (
            <div>
                <Buttons />
                <br />
                {mode !== Mode.settings && <Stats />}
                <br />
                <div style={{ height: 150 }}>
                    {mode !== Mode.settings && <Typing keydown={keydown} />}
                    {mode === Mode.settings && <Settings />}
                    {author !== undefined && (
                        <div>
                            <br />
                            <TextInfo />
                        </div>
                    )}
                </div>
                <br />
                {mode !== Mode.settings && <Hist />}
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
