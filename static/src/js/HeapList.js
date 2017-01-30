import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import update from 'immutability-helper'

import '../styles/HeapList.css'
import { heapListQuery } from './queries.js'
import { mutationTypes } from './mutations.js'


function HeapList({ user, refetch, loading }) {
  function renderHeapList() {
    if (user) {
      return user.heapList.sources.map((sourceItem) => {
        return (
          <a
            href={sourceItem.sourceUrl}
            target='_blank'
            key={sourceItem.id}
            className='sourceItem'
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

  return (
    <div className='HeapList'>
      {renderHeapList()}
    </div>
  )
}

// the variables we want to use with the query
const options = () => {
  return {
    // we need this reducer for when we add new sources
    reducer: (previousResult, action, variables) => {
      if (action.type === mutationTypes.APOLLO_MUTATION_RESULT && action.operationName === mutationTypes.createSource) {
        console.log("what know", previousResult, action, variables)
        // this is merging the new source into our current list of sources
        return update(previousResult, {
          user: {
            heapList: {
              sources: {
                $unshift: [action.result.data.createSource],
              },
            },
          },
        });
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
