import React from 'react'
import { graphql } from 'react-apollo'
import { DropTarget } from 'react-dnd'
import classNames from 'classnames'
import { Link } from 'react-router'

import '../styles/SourceListBlock.css'
import { updateSource } from './mutations.js'
import { listTarget, listCollect, ItemTypes } from './DragNDrop.js'

// hard coding for now, need to go back and rework routing strucutre
class SourceListBlock extends React.Component {
  render() {
    return this.props.connectDropTarget(
      <div
        key={this.props.sourceList.id}
        className={classNames({
          'SourceListBlock': true,
          'highlight': this.props.isOver,
          'isHeap': this.props.sourceList.isHeap,
        })}
      >
        <Link to={`/${this.props.username}/${this.props.sourceList.id}/`}>
          <div className='list-name'>
            {this.props.sourceList.name}
          </div>
        </Link>
      </div>
    )
  }
}


const props = ({ ownProps, mutate }) => {
  return {
    updateSource: (id, sourceListId) => {
      mutate({ variables: { userId: ownProps.userId, sourceData: { id, sourceListId }}})
    }
  }
}


// export the 'connected' component
export default graphql(updateSource, { props })(DropTarget(ItemTypes.SOURCE, listTarget, listCollect)(SourceListBlock))
