import * as React from 'react'

class Settings extends React.Component {
    render() {
        return (
            <div>
                <label
                    for='lang'
                    style={{ display: 'inline-block', width: 110 }}
                >
                    Language:{' '}
                </label>
                <select
                    name='lang'
                    id='lang'
                    style={{ display: 'inline-block', width: 80 }}
                    onChange={e =>
                        localStorage.setItem('language', e.target.value)
                    }
                    defaultValue={localStorage.getItem('language')}
                >
                    <option value='en'>English</option>
                    <option value='de'>German</option>
                </select>
                <br />
                <label
                    for='lang'
                    style={{ display: 'inline-block', width: 110 }}
                >
                    Max. Errors:{' '}
                </label>
                <select
                    name='lang'
                    id='lang'
                    style={{ display: 'inline-block', width: 80 }}
                    onChange={e =>
                        localStorage.setItem('maxError', e.target.value)
                    }
                    defaultValue={localStorage.getItem('maxError')}
                >
                    <option value={Number.MAX_SAFE_INTEGER}>unlimited</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                </select>
                <br /> <br />
                If you have any questions, suggestions or want to find out
                <br />
                more about this project visit the project website on{' '}
                <a href='https://github.com/madnight/keebacy#faq'>GitHub</a>.
            </div>
        )
    }
}

export default Settings
