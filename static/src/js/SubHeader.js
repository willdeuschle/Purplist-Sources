import React, { Component } from 'react'

import '../styles/SubHeader.css'
import CreateSourceList from './CreateSourceList.js'


class SubHeader extends Component {
  constructor() {
    super()
    this.renderListTitle = this.renderListTitle.bind(this)
  }

  renderListTitle() {
    if (this.props.user) {
      return (
        <div className='ListTitle'>
          {this.props.user.name}'s Heap
          <hr/>
          <div className='ListTitle-button-row'>
            <i className='fa fa-info ListTitleControl' />
            <i className='fa fa-download ListTitleControl' />
            <i className='fa fa-envelope-o ListTitleControl' />
            <i className='fa fa-trash-o ListTitleControl' />
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className='SubHeader'>
        <div className='IndividualStats'>
          stats
        </div>
        <div className='ListTitleAndTools'>
          {this.renderListTitle()}
        </div>
        <div className='CreateSourceList-wrapper'>
          <CreateSourceList />
        </div>
      </div>
    )
  }
}

export default SubHeader
