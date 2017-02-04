import React, { Component } from 'react'
import { DragSource } from 'react-dnd'

import { sourceSource, sourceCollect } from './DragNDrop.js'
import ItemTypes from './ItemTypes'


class SourceItem extends Component {
  render() {
    const sourceItem = this.props.sourceItem
    if (sourceItem) {
      return this.props.connectDragSource(
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
    }
  }
}

export default (DragSource(ItemTypes.SOURCE, sourceSource, sourceCollect)(SourceItem))
