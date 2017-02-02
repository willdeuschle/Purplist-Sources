import React, { Component } from 'react'
import Sortable from 'sortablejs'
import { graphql } from 'react-apollo'

import '../styles/SourceTools.css'
import CreateSource from './CreateSource.js'
import { deleteSource } from './mutations.js'


class SourceTools extends Component {
  componentDidMount() {
    console.log("what props", this.props)
    this.props.initializeDraggables((id) => this.props.deleteSource(id))
  }

  render() {
    return (
      <div className='SourceTools'>
        <div className='SourceTool'>
          <CreateSource />
        </div>
        <div className='delete-source SourceTool'>
          <i
            id='SourceTrash'
            className='fa fa-trash-o SourceTools-icon delete-source'
          />
        </div>
        <div className='explain-SourceTools SourceTool'>
          <i
            className='fa fa-info SourceTools-icon explain-source'
          />
        </div>
      </div>
    )
  }
}

// need to pass variables with the id of the source
const props = ({ mutate }) => {
  return {
    deleteSource: (id) => {
      mutate({ variables: { id }})
        .then((response) => console.log("deleted this object", response))
    }
  }
}

export default graphql(deleteSource, { props })(SourceTools)
