import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import ReactTooltip from 'react-tooltip'

import '../styles/SourceTools.css'
import CreateSource from './CreateSource.js'
import SourceTrash from './SourceTrash.js'
import { SourceToolsTip } from './constants.js'


class SourceTools extends Component {
  render() {
    // only want to display the source tools if the current user is viewing
    // their own profile
    if (window.cu_id === parseInt(this.props.userId)) {
      return (
        <div className='SourceTools'>
          <div className='SourceTool'>
            <CreateSource
              userId={this.props.userId}
              sourceListId={this.props.sourceListId}
            />
          </div>
          <div className='delete-source SourceTool'>
            <SourceTrash userId={this.props.userId} />
          </div>
          <div className='explain-SourceTools SourceTool'>
            <i
              data-place={'top'}
              data-effect='solid'
              data-tip={SourceToolsTip}
              data-for='SourceToolsTip'
              className='fa fa-info SourceTools-icon explain-source'
            />
            <ReactTooltip id='SourceToolsTip' />
          </div>
        </div>
      )
    }
    return false
  }
}

export default SourceTools
