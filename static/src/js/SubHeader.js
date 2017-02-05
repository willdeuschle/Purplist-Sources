import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

import '../styles/SubHeader.css'
import CreateSourceList from './CreateSourceList.js'
import { currentUserDataQuery } from './queries.js'
import { mutationTypes } from './mutations.js'


class SubHeader extends Component {
  constructor() {
    super()
    this.renderListTitle = this.renderListTitle.bind(this)
    this.renderIndividualStats = this.renderIndividualStats.bind(this)
  }

  renderIndividualStats() {
    return (
      <div className='IndividualStats'>
        <div className='num-sources'>
          Total sources: {this.props.user.numSources}
        </div>
        <div className='num-source-lists'>
          Total source lists: {this.props.user.numSourceLists}
        </div>
      </div>
    )
  }

  renderListTitle() {
    return (
      <div className='ListTitle'>
        {this.props.sourceList.isHeap ? `${this.props.user.name}'s Heap` : this.props.sourceList.name}
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
    reducer: (previousResult, action, variables) => {
      if (action.type === mutationTypes.APOLLO_MUTATION_RESULT) {
        switch(action.operationName) {
          case mutationTypes.createSourceList:
            return update(previousResult, {
              user: {
                numSourceLists: {
                  $set: previousResult.user.numSourceLists + 1
                },
              },
            })
          case mutationTypes.createSource:
            return update(previousResult, {
              user: {
                numSources: {
                  $set: previousResult.user.numSources + 1
                },
              },
            })
          case mutationTypes.deleteSource:
            return update(previousResult, {
              user: {
                numSources: {
                  $set: previousResult.user.numSources - 1
                },
              },
            })
          default:
            return previousResult
        }
      }
      // return previous otherwise
      return previousResult
    },
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
