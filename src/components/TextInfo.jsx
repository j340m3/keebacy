import * as React from 'react'
import { connect } from 'react-redux'

class TextInfo extends React.Component {
  render() {
    const { author, context } = this.props
    return (
      <div>
        -{author}{context ? ", " + context : ""}
      </div>
    )
  }
}

const matchStateToProps = (state) => {
  return {
    author: state.textData.author,
    context: state.textData.context,
  }
}

export default connect(matchStateToProps)(TextInfo)
