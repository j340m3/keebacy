import * as React from 'react'
import keydown, { ALL_KEYS } from 'react-keydown'
import { connect } from 'react-redux'

import Buttons from '../components/Buttons'
import Stats from '../components/StatsBar'
import Hist from '../components/HistStats'
import Typing from '../components/Typing'
import TextInfo from './TextInfo'

@keydown(ALL_KEYS)
class App extends React.Component {

  render() {
    // tslint:disable-next-line:no-shadowed-variable
    const { author, keydown } = this.props
    return (
      <div>
        <Buttons />
        <br />
        <Stats />
        <br />
        <div style={{ height: 150 }}>
        <Typing keydown={keydown} />
        {author !== undefined && (
          <div>
            <br />
            <TextInfo />
          </div>
        )}
          </div>
        <br />
        <Hist />
        <br />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    author: state.textData.author,
  }
}

export default connect(mapStateToProps)(App)
