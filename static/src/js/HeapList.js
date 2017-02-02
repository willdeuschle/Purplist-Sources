import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

import '../styles/HeapList.css'
import { heapListQuery } from './queries.js'
import { mutationTypes } from './mutations.js'


class HeapList extends React.Component {
  constructor() {
    super()
    this.renderHeapList = this.renderHeapList.bind(this)
  }

  componentDidMount() {
    this.props.initializeDraggables()
  }

  renderHeapList() {
    console.log("wut", this.props)
    if (this.props.user) {
      return this.props.user.heapList.sources.map((sourceItem) => {
        return (
          <a
            href={sourceItem.sourceUrl}
            target='_blank'
            key={sourceItem.id}
            className='sourceItem'
            data-id={sourceItem.id}
          >
            <div className='sourceImgWrapper'>
              <img className='sourceImg' src={sourceItem.faviconUrl}/>
            </div>
            <div className='sourceTxtWrapper'>
              {sourceItem.title}
            </div>
          </a>
        )
      })
    }
  }

  render() {
    return (
      <div className='HeapList' id='HeapList'>
        {this.renderHeapList()}
      </div>
    )
  }
}

// the variables we want to use with the query
const options = () => {
  return {
    // we need this reducer for when we add new sources or update sources
    reducer: (previousResult, action, variables) => {
      if (action.type === mutationTypes.APOLLO_MUTATION_RESULT && action.operationName === mutationTypes.createSource) {
        console.log("what know", previousResult, action, variables)
        // this is merging the new source into our current list of sources
        return update(previousResult, {
          user: {
            heapList: {
              sources: {
                $unshift: [],
              },
            },
          },
        });
      } else if (action.type === mutationTypes.APOLLO_MUTATION_RESULT && action.operationName === mutationTypes.updateSource) {
        // need to filter out the removed object actually!
        // add it back if need be
        // want to reintegrate it if part of our current list
        // NOTE: could eventually merge the first and second case together,
        // but for now we're going to leave them separate until we make a firmer
        // decision on how using multiple lists will go
        if (action.result.data.updateSource.sourceListId === previousResult.user.heapList.id) {
          return update(previousResult, {
            user: {
              heapList: {
                sources: {
                  $unshift: [action.result.data.updateSource],
                },
              },
            },
          });
        }
      }
      // if this isn't a special case, return the previous result
      return previousResult
    },
    variables: {
      cu_id: window.cu_id,
    },
  }
}

// potentially rename our props in the future
const props = ({ ownProps, data: { user, loading }}) => ({
  user,
  loading,
})

// export the 'connected' component
export default graphql(heapListQuery, {
  options,
  props,
})(HeapList)
