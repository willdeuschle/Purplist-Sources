import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

import '../styles/SourceList.css'
import { sourceListQuery } from './queries.js'
import { mutationTypes } from './mutations.js'
import SourceListReducer from './reducers/SourceListReducer.js'
import SourceItem from './SourceItem.js'


class SourceList extends React.Component {
  constructor() {
    super()
    this.renderSourceList = this.renderSourceList.bind(this)
  }

  renderSourceList() {
    console.log("heap list props", this.props)
    if (this.props.sourceList) {
      return this.props.sourceList.sources.map(
        (sourceItem) => <SourceItem key={sourceItem.id} sourceItem={sourceItem} />
      )
    }
  }

  render() {
    return (
      <div className='SourceList'>
        {this.renderSourceList()}
      </div>
    )
  }
}

// the variables we want to use with the query
const options = (ownProps) => {
  console.log("what info", ownProps)
  return {
    // we need this reducer for when we add, delete, or update sources
    reducer: SourceListReducer,
    variables: {
      userId: ownProps.userId,
      sourceListId: ownProps.sourceListId,
    },
  }
}

// potentially rename our props in the future
const props = ({ ownProps, data: { sourceList, loading }}) => ({
  sourceList,
  loading,
})

// export the 'connected' component
export default graphql(sourceListQuery, {
  options,
  props,
})(SourceList)
