export const sourceSource = {
  beginDrag(props) {
    return { id: props.sourceItem.id }
  }
}

export function sourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

export const trashTarget = {
  drop(props, monitor) {
    const sourceItem = monitor.getItem()
    //props.deleteSource(sourceItem.id)
  }
}

export function trashCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}
