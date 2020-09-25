import * as React from 'react'
import keydown, { ALL_KEYS } from 'react-keydown'
import { connect } from 'react-redux'

import Buttons from '../components/Buttons'
import Settings from '../components/Settings'
import Stats from '../components/StatsBar'
import Typing from '../components/Typing'
import TextInfo from './TextInfo'
import { MODE } from '../constants'

@keydown(ALL_KEYS)
class App extends React.Component {
    render() {
        // tslint:disable-next-line:no-shadowed-variable
        const { author, keydown, mode } = this.props
        return (
            <div>
                <Buttons />
                <br />
                {mode !== MODE.SETTINGS && <Stats />}
                <br />
                <div
                    style={{
                        minHeight: 130,
                        overflow: 'hidden',
                        display: 'block',
                    }}
                >
                    {mode !== MODE.SETTINGS && <Typing keydown={keydown} />}
                    {mode === MODE.SETTINGS && <Settings />}
                    {author !== undefined && (
                        <div>
                            <br />
                            <TextInfo />
                        </div>
                    )}
                </div>
                <br />
                {mode !== MODE.SETTINGS && <Stats histMode={true} />}
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
