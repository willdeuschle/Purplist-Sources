import React, { Component } from 'react'
import {
  graphql,
  compose,
} from 'react-apollo'
import update from 'immutability-helper'

import SourceListBlock from './SourceListBlock.js'
import { sourceListsQuery } from './queries.js'
import {
  mutationTypes,
  updateSource,
} from './mutations.js'

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
    reducer: (previousResult, action, variables) => {
      if (action.type === mutationTypes.APOLLO_MUTATION_RESULT && action.operationName === mutationTypes.createSourceList) {
        console.log("in the mutation", previousResult, action)
        return update(previousResult, {
          sourceLists: {
            $push: [action.result.data.createSourceList]
          }
        })
      }
      // return previous result if not doing anything special
      return previousResult
    },
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
export default compose(
  graphql(sourceListsQuery, {
    options: queryOptions,
    props: queryProps,
  }),
)(SourceListColumn)
