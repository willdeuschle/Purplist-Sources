import React, { Component } from 'react'
import { graphql } from 'react-apollo'

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


class PageContent extends Component {
  render() {
    console.log('boomshakalaka', this.props)
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

//export default PageContent
