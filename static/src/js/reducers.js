import { mutationTypes } from './mutations.js'
import update from 'immutability-helper'


export const subHeaderReducer = (previousResult, action, variables) => {
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
}


export const sourceListColumnReducer = (previousResult, action, variables) => {
  if (action.type === mutationTypes.APOLLO_MUTATION_RESULT && action.operationName === mutationTypes.createSourceList) {
    console.log("in the mutation", previousResult, action)
    return update(previousResult, {
      sourceLists: {
        $push: [action.result.data.createSourceList]
      }
    })
  }
  // return previous result if not doing anything special
  return previousResult
}


export const sourceListReducer = (previousResult, action, variables) => {
  // if we are mutating, want to update what is stored
  if (action.type === mutationTypes.APOLLO_MUTATION_RESULT) {
    switch(action.operationName) {
      case mutationTypes.createSource:
        // adding a source
        return update(previousResult, {
          sourceList: {
            sources: {
              $unshift: [action.result.data.createSource],
            },
          },
        });
      case mutationTypes.updateSource:
        // changing a current source
        // if it was just added to the same list return the previous result
        console.log("hm", action, previousResult)
        if (action.result.data.updateSource.sourceListId === previousResult.sourceList.id) {
          return previousResult
        }
        // otherwise filter it out of the currently displayed list
        return update(previousResult, {
          sourceList: {
            sources: {
              $apply: currentArr => currentArr.filter(source => source.id != action.result.data.updateSource.id)
            },
          },
        });
      case mutationTypes.deleteSource:
        // need to do something for deleting a source
        return update(previousResult, {
          sourceList: {
            sources: {
              $apply: currentArr => currentArr.filter(source => source.id != action.result.data.deleteSource.id)
            },
          },
        });
      default:
        return previousResult
    }
  }
  // otherwise we can just return the previous result
  return previousResult
}
