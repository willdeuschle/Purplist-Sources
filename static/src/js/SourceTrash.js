import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { DropTarget } from 'react-dnd'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

import '../styles/SourceTrash.css'
import { deleteSource } from './mutations.js'
import { trashTarget, trashCollect, ItemTypes } from './DragNDrop.js'
import { SourceTrashTip } from './constants.js'


class SourceTrash extends Component {
  render() {
    return this.props.connectDropTarget(
      <span>
        <i
          id='SourceTrash'
          data-place={'top'}
          data-effect='solid'
          data-tip={SourceTrashTip}
          data-for='SourceTrashTip'
          className={classNames({
            'fa fa-trash-o': true,
            'SourceTools-icon': true,
            'delete-source': true,
            'highlight': this.props.isOver,
          })}
        />
        <ReactTooltip id='SourceTrashTip' />
      </span>
    )
  }
}

// need to pass variables with the id of the source
const props = ({ ownProps, mutate }) => {
  return {
    deleteSource: (id) => {
      mutate({ variables: { userId: ownProps.userId, id }})
    }
  }
}

export default graphql(deleteSource, { props })(DropTarget(ItemTypes.SOURCE, trashTarget, trashCollect)(SourceTrash))
