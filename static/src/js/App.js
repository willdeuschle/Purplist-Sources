import React, { Component } from 'react'
import ApolloClient from 'apollo-client'
import { ApolloProvider, graphql } from 'react-apollo'
import gql from 'graphql-tag'

// set up our ApolloClient for data management
const client = new ApolloClient()

// styling for this component
import '../styles/App.css'


// our base component
class App extends Component {
  renderHeapList() {
    if (this.props.user) {
      return this.props.user.heapList.sources.map((sourceItem) => {
        return (
          <a
            href={sourceItem.sourceUrl}
            target='_blank'
            key={sourceItem.id}
            className='sourceItem'
          >
            <div className='sourceImgWrapper'>
              <img className='sourceImg' src={sourceItem.faviconUrl}/>
            </div>
            <div className='sourceTxtWrapper'>
              {sourceItem.title}
            </div>
          </a>
        )
      })
    }
  }

  render() {
    return (
      <div className='reactive-base'>
        this is a protected page
        <div className='HeapList'>
          {this.renderHeapList()}
        </div>
        <a className='logout-button' href='logout'>Logout</a>
      </div>
    )
  }
}

export default App

// query for Apollo to execute
// we could access all of the sources from the
// user itself, but this creates a flatter
// data structure
const myQuery = gql`
  query ($cu_id: ID!) {
    user(userId: $cu_id) {
      nickname,
      heapList {
        name,
        sources {
          id,
          title,
          sourceUrl,
          faviconUrl,
        },
      },
    },
  }
`

// the variables we want to use with the query
const options = {
  variables: {
    cu_id: window.cu_id,
  },
}

// potentially rename our props in the future
const props = ({ ownProps, data: { user } }) => ({
  user: user,
})

// export the 'connected' component
export const AppWithData = graphql(myQuery, {
  options,
  props,
})(App)
