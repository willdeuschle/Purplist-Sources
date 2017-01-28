import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// styling for this component
import '../styles/App.css'
// the HeapList component
import HeapList from './HeapList.js'
// the CreateSource Component
import CreateSource from './CreateSource.js'


// our base component
class App extends Component {
  render() {
    return (
      <div className='reactive-base'>
        <CreateSource />
        <HeapList />
        <a className='logout-button' href='logout'>Logout</a>
      </div>
    )
  }
}

export default App

