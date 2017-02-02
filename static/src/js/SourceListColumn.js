import React, { Component } from 'react'
import {
  graphql,
  compose,
} from 'react-apollo'
import update from 'immutability-helper'

import { sourceListQuery } from './queries.js'
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

  componentDidMount() {
    this.props.initializeDraggables(
      (sourceId, sourceListId) => this.props.updateSource(sourceId, sourceListId)
    )
  }

  renderSourceLists() {
    if (this.props.sourceLists) {
      return this.props.sourceLists.map(source_list => {
        return(
          <div
            key={source_list.id}
            className='SourceListBlock'
            data-id={source_list.id}
          >
            {source_list.name}
          </div>
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
const queryOptions = () => {
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
      cu_id: window.cu_id,
    },
  }
}

// to rename in the future if we like
const queryProps = ({ ownProps, data: { sourceLists, loading }}) => ({
  sourceLists,
  loading,
})


const mutationProps = ({ mutate }) => {
  return {
    updateSource: (id, sourceListId) => {
      mutate({ variables: { sourceData: { id, sourceListId }}})
        .then((response) => console.log("what is resp", response))
    }
  }
}

// export the 'connected' component
export default compose(
  graphql(sourceListQuery, {
    options: queryOptions,
    props: queryProps,
  }),
  graphql(updateSource, {
    props: mutationProps,
  }),
)(SourceListColumn)
