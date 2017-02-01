import React, { Component } from 'react'

import '../styles/SourceTools.css'
import CreateSource from './CreateSource.js'


export default class SourceTools extends Component {
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
