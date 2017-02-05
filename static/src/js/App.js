import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
// trying react dnd instead
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

// data for this component
import { userQuery } from './queries.js'
// styling for this component
import '../styles/App.css'
// the Header for the page
import Header from './Header.js'
// the SourceTools component
import SourceTools from './SourceTools.js'
// the SourceList component
import SourceList from './SourceList.js'
// the SourceListColumn component
import SourceListColumn from './SourceListColumn.js'
// the SubHeader component
import SubHeader from './SubHeader.js'


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

//const options = (ownProps) => {
  //return {
    //variables: {
      //username: ownProps.params.username,
    //}
  //}
//}

//const props = ({ ownProps, data: { user, loading }}) => ({
  //user,
  //loading,
//})

//export default graphql(userQuery, {
  //options,
  //props,
//})(DragDropContext(HTML5Backend)(App))
//
export default DragDropContext(HTML5Backend)(App)
