import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
    render() {
        return (
            <div>
                hello world, this is a protected page
            </div>
        )
    }
}


ReactDOM.render(
    <App />, document.getElementById('root')
)
