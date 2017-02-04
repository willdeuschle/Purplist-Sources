import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

import '../styles/HeapList.css'
import { heapListQuery } from './queries.js'
import { mutationTypes } from './mutations.js'
import SourceListReducer from './reducers/SourceListReducer.js'
import SourceItem from './SourceItem.js'


class HeapList extends React.Component {
  constructor() {
    super()
    this.renderHeapList = this.renderHeapList.bind(this)
  }

  componentDidMount() {
    //this.props.initializeDraggables()
  }

  renderHeapList() {
    console.log("heap list props", this.props)
    if (this.props.user) {
      return this.props.user.heapList.sources.map(
        (sourceItem) => <SourceItem key={sourceItem.id} sourceItem={sourceItem} />
      )
    }
  }

  render() {
    return (
      <div className='HeapList' id='HeapList'>
        {this.renderHeapList()}
      </div>
    )
  }
}

// the variables we want to use with the query
const options = () => {
  return {
    // we need this reducer for when we add, delete, or update sources
    reducer: SourceListReducer,
    variables: {
      cu_id: window.cu_id,
    },
  }
}

// potentially rename our props in the future
const props = ({ ownProps, data: { user, loading }}) => ({
  user,
  loading,
})

// export the 'connected' component
export default graphql(heapListQuery, {
  options,
  props,
})(HeapList)
