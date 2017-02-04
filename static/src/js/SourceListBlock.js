import React from 'react'
import { graphql } from 'react-apollo'

import { updateSource } from './mutations.js'
import '../styles/SourceListBlock.css'


class SourceListBlock extends React.Component {
  componentDidMount() {
    // initialize our draggable by passing the id of our component as well
    // as the function to execute when something is dropped into it
    //this.props.initializeDraggables(
      //this._myId,
      //(sourceId, sourceListId) => this.props.updateSource(sourceId, sourceListId)
    //)
  }

  render() {
    // establish a unique id to pass to the draggable initializing function
    this._myId = `SourceListBlock-${this.props.sourceList.id}`

    return (
      <div
        id={this._myId}
        key={this.props.sourceList.id}
        className='SourceListBlock'
        data-id={this.props.sourceList.id}
      >
        <div className='list-name'>
          {this.props.sourceList.name}
        </div>
      </div>
    )
  }
}


const props = ({ mutate }) => {
  return {
    updateSource: (id, sourceListId) => {
      mutate({ variables: { sourceData: { id, sourceListId }}})
        .then((response) => console.log("what is resp", response))
    }
  }
}


// export the 'connected' component
export default graphql(updateSource, { props })(SourceListBlock)
