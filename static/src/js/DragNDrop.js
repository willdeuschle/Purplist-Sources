// need to pass an item type to the DragSource and DragTarget higher
// order functions - different components that need to interact together
// need to have the same type
export const ItemTypes = {
  SOURCE: 'source',
}

// properties for our source - specifies the item being dragged
// THIS ONE SPECIFIES DND BEHAVIOR
export const sourceSource = {
  beginDrag(props) {
    return { id: props.sourceItem.id }
  }
}

// provide the function to set up the drag source and indicate whether or
// not the item is currently being dragged
// THIS ONE GIVES PROPS
export function sourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

// properties for our target - set up the drop function to delete the source
// on drop
// THIS ONE SPECIFIES DND BEHAVIOR
export const trashTarget = {
  drop(props, monitor) {
    // get the currently dragged item
    const sourceItem = monitor.getItem()
    // delete it
    props.deleteSource(sourceItem.id)
  }
}

// provide the function to connect the drop target as well as whether or not
// we are currently hovering over it
// THIS ONE GIVES PROPS
export function trashCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}

// same as for the trash target - we are setting up the properties for our
// list target
// THIS ONE GIVES PROPS
export const listTarget = {
  drop(props, monitor) {
    // get the currently dragged item
    const sourceItem = monitor.getItem()
    // update its list
    props.updateSource(sourceItem.id, props.sourceList.id)
  }
}

// same as for the trash, provide the function to connect the drop target as
// well as whether or not it is currently hovered over
// THIS ONE SPECIFIES DND BEHAVIOR
export function listCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}
