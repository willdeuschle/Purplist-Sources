export const sourceSource = {
  beginDrag(props) {
    return { id: props.id }
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
    console.log("what have sireeeeeeeeee", props, monitor.getItem())
  }
}

export function trashCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}
