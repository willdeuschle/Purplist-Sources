import React, { Component } from 'react'
import Sortable from 'sortablejs'

import '../styles/SourceTools.css'
import CreateSource from './CreateSource.js'


class SourceTools extends Component {
  componentDidMount() {
    console.log("what props", this.props)
    this.props.initializeDraggables(() => console.log("hello cb"))
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
//const options = () => {
  //return {
    //variables: {
      //sourceData: {
        //id,
      //},
    //},
  //}
//}

export default SourceTools
