import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// styling for this component
import '../styles/App.css'
// the Header for the page
import Header from './Header.js'
// the SourceTools component
import SourceTools from './SourceTools.js'
// the HeapList component
import HeapList from './HeapList.js'
// the SourceListColumn component
import SourceListColumn from './SourceListColumn.js'
// the SubHeader component
import SubHeader from './SubHeader.js'
// the draggable initializing
import initializeDraggables from './initializeDraggables.js'


// our base component
class App extends Component {
  componentDidMount() {
    console.log("Mounted");
    initializeDraggables()
  }

  componentWillUnmount() {
    console.log("werird")
  }

  render() {
    return (
      <div className='reactive-base'>
        <Header />
        <div className='page-content-subheader'>
          <SubHeader />
        </div>
        <div className='page-content'>
            <div className='SourceTools-wrapper content-thirds'>
              <SourceTools />
            </div>
            <div className='HeapList-wrapper content-thirds'>
              <HeapList />
            </div>
            <div className='SourceListColumn-wrapper content-thirds'>
              <SourceListColumn />
            </div>
        </div>
        <a className='logout-button' href='logout'>Logout</a>
      </div>
    )
  }
}

export default App

