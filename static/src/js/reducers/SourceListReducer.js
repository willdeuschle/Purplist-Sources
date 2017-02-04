import update from 'immutability-helper'
import { mutationTypes } from '../mutations.js'

export default function SourceListReducer (previousResult, action, variables) {
  console.log("what have now", previousResult)
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
