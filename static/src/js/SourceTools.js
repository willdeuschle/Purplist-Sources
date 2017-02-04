import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import '../styles/SourceTools.css'
import CreateSource from './CreateSource.js'
import SourceTrash from './SourceTrash.js'


class SourceTools extends Component {
  componentDidMount() {
    console.log("what props", this.props)
    //this.props.initializeDraggables((id) => this.props.deleteSource(id))
  }

  render() {
    return (
      <div className='SourceTools'>
        <div className='SourceTool'>
          <CreateSource />
        </div>
        <div className='delete-source SourceTool'>
          <SourceTrash />
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

export default SourceTools
