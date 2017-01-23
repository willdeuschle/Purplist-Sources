import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import '../styles/App.css'

class App extends Component {
    componentDidMount() {
        console.log("now need to access some data")
    }

    render() {
        return (
            <div className='reactive-base'>
                hello world, this is a protected page
                <a className='foo' href='logout'>Logout</a>
            </div>
        )
    }
}


ReactDOM.render(
    <App />, document.getElementById('root')
)
