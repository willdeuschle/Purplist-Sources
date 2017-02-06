import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import '../styles/PageContent.css'
// data for this component
import { userQuery } from './queries.js'
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


// this paradigm may eventually change based on how the graphql community
// decides to manage shared data across components, but for now here is the
// set up: we are navigating around via the username and a source list id in
// the url. it is the responsiblity of the PageContent component to convert
// the username into a user (more importantly, the user id) which can then
// be passed to child components so that they can manage their own data
// fetching. we will want to figure out some means of data batching at some
// point, but for now this is working pretty well
class PageContent extends Component {
  render() {
    if (this.props.user) {
      return (
        <div className='PageContent'>
           <div className='page-content-subheader'>
             <SubHeader
               userId={this.props.user.id}
               sourceListId={this.props.params.sourceListId}
             />
           </div>
           <div className='page-content'>
             <div className='SourceTools-wrapper content-thirds'>
               <SourceTools
                 userId={this.props.user.id}
               />
             </div>
             <div className='SourceList-wrapper content-thirds'>
               <SourceList
                 userId={this.props.user.id}
                 sourceListId={this.props.params.sourceListId}
               />
             </div>
             <div className='SourceListColumn-wrapper content-thirds'>
               <SourceListColumn
                 userId={this.props.user.id}
                 username={this.props.user.username}
               />
             </div>
           </div>
        </div>
      )
    } else {
      return null
    }
  }
}

const options = (ownProps) => {
  return {
    variables: {
      username: ownProps.params.username,
    }
  }
}

const props = ({ ownProps, data: { user, loading }}) => ({
  user,
  loading,
})

export default graphql(userQuery, {
  options,
  props,
})(PageContent)
