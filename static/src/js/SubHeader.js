import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import ReactTooltip from 'react-tooltip'

import '../styles/SubHeader.css'
import CreateSourceList from './CreateSourceList.js'
import { currentUserDataQuery } from './queries.js'
import { subHeaderReducer } from './reducers.js'
import DeleteSourceList from './DeleteSourceList.js'
import {
  ListTitleControlTip,
  DownloadTip,
  EmailTip,
  DeleteListTip,
} from './constants.js'


class SubHeader extends Component {
  constructor() {
    super()
    this.renderListTitle = this.renderListTitle.bind(this)
    this.renderIndividualStats = this.renderIndividualStats.bind(this)
    this.renderDelete = this.renderDelete.bind(this)
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

  renderDelete() {
    if (window.cu_id === parseInt(this.props.userId)) {
      return (
          <DeleteSourceList
            userId={this.props.userId}
            sourceListId={this.props.sourceList.id}
            canDelete={!this.props.sourceList.isHeap}
          />
      )
    }
    return null
  }

  renderListTitle() {
    return (
      <div className='ListTitle'>
        {this.props.sourceList.isHeap ?
          <span className='heap-title'>The Heap</span> :
          <span className='list-title'>{this.props.sourceList.name}</span>
        }
        <hr/>
        <div className='ListTitle-button-row'>
          <i
            data-place={'bottom'}
            data-effect='solid'
            data-tip={ListTitleControlTip}
            data-for='ListTitleControlTip'
            className='fa fa-info no-hover ListTitleControl'
          />
          <ReactTooltip id='ListTitleControlTip' />
          <a
            href={`/download/${this.props.sourceList.id}`}
            className='fa fa-download ListTitleControl'
            data-place={'bottom'}
            data-effect='solid'
            data-tip={DownloadTip}
            data-for='DownloadTip'
          />
          <ReactTooltip id='DownloadTip' />
          <a
            href={`mailto:?to=&body=Link here: ${window.location.href}&subject=${this.props.user.name}: ${this.props.sourceList.name}`}
            className='fa fa-envelope-o ListTitleControl'
            data-place={'bottom'}
            data-effect='solid'
            data-tip={EmailTip}
            data-for='EmailTip'
          />
          <ReactTooltip id='EmailTip' />
          {this.renderDelete()}
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
