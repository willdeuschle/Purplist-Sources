import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { userQuery } from './queries.js'
import CreateSourceList from './CreateSourceList.js'

import '../styles/SubHeader.css'


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

// could eventually rename these if we wished
const props = ({ ownProps, data: { user, loading }}) => ({
  user,
  loading,
})

const options = () => {
  return {
    variables: {
      cu_id: window.cu_id,
    },
  }
}

export default graphql(userQuery, {
  options,
  props,
})(SubHeader)
