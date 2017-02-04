import React from 'react'
import { graphql } from 'react-apollo'
import { DropTarget } from 'react-dnd'
import classNames from 'classnames'

import '../styles/SourceListBlock.css'
import { updateSource } from './mutations.js'
import { listTarget, listCollect, ItemTypes } from './DragNDrop.js'


class SourceListBlock extends React.Component {
  render() {
    return this.props.connectDropTarget(
      <div
        key={this.props.sourceList.id}
        className={classNames({
          'SourceListBlock': true,
          'highlight': this.props.isOver,
        })}
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
export default graphql(updateSource, { props })(DropTarget(ItemTypes.SOURCE, listTarget, listCollect)(SourceListBlock))
