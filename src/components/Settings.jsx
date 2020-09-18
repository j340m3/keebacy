import * as React from 'react'
import { connect } from 'react-redux'

class Settings extends React.Component {
    handleSelectChange(e) {
        localStorage.setItem('language', e.target.value)
    }

    render() {
        return (
            <div>
                <label for='lang'>Language: </label>
                <select
                    name='lang'
                    id='lang'
                    onChange={this.handleSelectChange}
                    defaultValue={localStorage.getItem('language')}
                >
                    <option value='en'>English</option>
                    <option value='de'>German</option>
                </select>
            </div>
        )
    }
}

export default Settings
