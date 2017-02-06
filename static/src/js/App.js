import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

// styling for this component
import '../styles/App.css'
// the Header for the page
import Header from './Header.js'


// our base component
class App extends Component {
  render() {
    return (
      <div className='reactive-base'>
        <Header />
        {this.props.children}
        <a className='logout-button' href='/logout'>Logout</a>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
