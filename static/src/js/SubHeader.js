import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import '../styles/SubHeader.css'
import CreateSourceList from './CreateSourceList.js'
import { currentUserDataQuery } from './queries.js'
import { subHeaderReducer } from './reducers.js'
import DeleteSourceList from './DeleteSourceList.js'


class SubHeader extends Component {
  constructor() {
    super()
    this.renderListTitle = this.renderListTitle.bind(this)
    this.renderIndividualStats = this.renderIndividualStats.bind(this)
  }

  renderIndividualStats() {
    return (
      <div className='IndividualStats'>
        <div className='person-header'>
          {this.props.user.name}
        </div>
        <div className='source-stats'>
          <hr className='name-separator' />
          Sources: <span className='stat-val'>{this.props.user.numSources}</span> |
          Source Lists: <span className='stat-val'>{this.props.user.numSourceLists}</span>
        </div>
      </div>
    )
  }

  renderListTitle() {
    return (
      <div className='ListTitle'>
        {this.props.sourceList.isHeap ? <span className='heap-title'>The Heap</span> : this.props.sourceList.name}
        <hr/>
        <div className='ListTitle-button-row'>
          <i className='fa fa-info ListTitleControl' />
          <i className='fa fa-download ListTitleControl' />
          <i className='fa fa-envelope-o ListTitleControl' />
          <DeleteSourceList
            userId={this.props.userId}
            sourceListId={this.props.sourceList.id}
            canDelete={!this.props.sourceList.isHeap}
          />
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.loading) {
      return (
        <div className='SubHeader'>
          {this.renderIndividualStats()}
          <div className='ListTitleAndTools'>
            {this.renderListTitle()}
          </div>
          <div className='CreateSourceList-wrapper'>
            <CreateSourceList userId={this.props.userId} />
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

const options = ownProps => {
  return {
    reducer: subHeaderReducer,
    variables: {
      userId: ownProps.userId,
      sourceListId: ownProps.sourceListId,
    }
  }
}

const props = ({ ownProps, data: { user, sourceList, loading }}) => ({
  user,
  sourceList,
  loading,
})


export default graphql(currentUserDataQuery, {
  options,
  props,
})(SubHeader)
