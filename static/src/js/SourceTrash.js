import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { DropTarget } from 'react-dnd'
import classNames from 'classnames'

import '../styles/SourceTrash.css'
import { deleteSource } from './mutations.js'
import ItemTypes from './ItemTypes'
import { trashTarget, trashCollect } from './DragNDrop.js'


class SourceTrash extends Component {
  render() {
    console.log('Source trash propss', this.props)
    return this.props.connectDropTarget(
      <i
        id='SourceTrash'
        className={classNames({
          'fa fa-trash-o': true,
          'SourceTools-icon': true,
          'delete-source': true,
          'highlight': this.props.isOver,
        })}
      />
    )
  }
}

// need to pass variables with the id of the source
const props = ({ mutate }) => {
  return {
    deleteSource: (id) => {
      mutate({ variables: { id }})
        .then((response) => console.log("deleted this object", response))
    }
  }
}

export default graphql(deleteSource, { props })(DropTarget(ItemTypes.SOURCE, trashTarget, trashCollect)(SourceTrash))
