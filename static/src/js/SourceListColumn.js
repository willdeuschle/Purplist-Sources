import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { sourceListQuery } from './queries.js'

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
      <div className='SourceListColumn'>
        {this.renderSourceLists()}
      </div>
    )
  }
}

const options = () => {
  return {
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
