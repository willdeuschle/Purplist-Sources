import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

import { sourceListQuery } from './queries.js'
import { mutationTypes } from './mutations.js'

import '../styles/SourceListColumn.css'


class SourceListColumn extends Component {
  constructor() {
    super()
    this.renderSourceLists = this.renderSourceLists.bind(this)
  }

  renderSourceLists() {
    if (this.props.sourceLists) {
      return this.props.sourceLists.map(source_list => {
        return(
          <div key={source_list.id} className='SourceListBlock'>
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

const options = () => {
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
const props = ({ ownProps, data: { sourceLists, loading }}) => ({
  sourceLists,
  loading,
})

// export the 'connected' component
export default graphql(sourceListQuery, {
  options,
  props,
})(SourceListColumn)
