import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import SourceListBlock from './SourceListBlock.js'
import { sourceListsQuery } from './queries.js'
import { sourceListColumnReducer } from './reducers.js'

import '../styles/SourceListColumn.css'


class SourceListColumn extends Component {
  constructor() {
    super()
    this.renderSourceLists = this.renderSourceLists.bind(this)
  }

  // render each source list with the dnd initializing function it needs
  renderSourceLists() {
    if (this.props.sourceLists) {
      return this.props.sourceLists.map(sourceList => {
        return(
          <SourceListBlock
            key={sourceList.id}
            sourceList={sourceList}
            userId={this.props.userId}
            username={this.props.username}
          />
        )
      })
    }
  }

  render() {
    return (
      <div id='SourceListColumn' className='SourceListColumn'>
        {this.renderSourceLists()}
      </div>
    )
  }
}

// options for this components querying
const queryOptions = (ownProps) => {
  return {
    // we need this reducer for when we add new SourceLists
    reducer: sourceListColumnReducer,
    variables: {
      userId: ownProps.userId,
    },
  }
}

// to rename in the future if we like
const queryProps = ({ ownProps, data: { sourceLists, loading }}) => ({
  sourceLists,
  loading,
})

// no longer need to compose, leaving it here as an example for now
export default graphql(sourceListsQuery, {
  options: queryOptions,
  props: queryProps,
})(SourceListColumn)
