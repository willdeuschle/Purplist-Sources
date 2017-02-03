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
          user: {
            heapList: {
              sources: {
                $unshift: [action.result.data.createSource],
              },
            },
          },
        });
      case mutationTypes.updateSource:
        // changing a current source
        // need to update whatever is currently in the store
        return update(previousResult, {
          user: {
            heapList: {
              sources: {
                $unshift: [action.result.data.updateSource],
              },
            },
          },
        });
      case mutationTypes.deleteSource:
        // need to do something for deleting a source
        console.log("diong this ish", previousResult, action, variables)
        return update(previousResult, {
          user: {
            heapList: {
              sources: {
                $apply: (currentArr) => currentArr.filter((source) => source.id != action.result.data.deleteSource.id)
              },
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
