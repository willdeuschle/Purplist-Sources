import Sortable from 'sortablejs'


// the initializing function takes and id so that we know where in
// the dom to access each source block as well as a callback
// to execute when something is dropped into one of the source blocks
export function initializeSourceListBlockDraggables(blockId, cb) {
  // function invoked when something added to one of the sourceListBlocks
  function onListAdd(evt) {
    console.log("well what have", evt)
    const sourceId = evt.item.attributes['data-id'].value
    const sourceListId = evt.to.attributes['data-id'].value
    evt.to.removeChild(evt.item)
    // invoke the callback to add the item to the proper list
    cb(sourceId, sourceListId)
  }

  // start by getting the block from the dom, we are passed
  // the id so we know what to look for
  const sourceListBlock = document.getElementById(blockId)

  // this function initializes each SourceListBlock
  // creating a sortable with the group of 'SourceMvmt', allowing things
  // of the group 'SourceMvmt' to be put in it, specifying the function
  // to call when something is added, and specifying the ghost class for
  // the draggable
  Sortable.create(
    sourceListBlock,
    {
      group: 'SourceMvmt',
      put: ['SourceMvmt'],
      ghostClass: 'highlightGhost',
      onAdd: onListAdd
    }
  )
}


export function initializeHeapListDraggables(cb) {
  // grab the HeapList from the dom
  const heapList = document.getElementById('HeapList')

  // this functions sets the draggable image as well as where our
  // cursor will be dragging that image from (set to the middle)
  function setData(dataTransfer, dragEl) {
    console.log("what in dataTransfer", dataTransfer, dataTransfer.setDragImage, dragEl, dragEl.offsetWidth)
    dataTransfer.setDragImage(dragEl, (dragEl.offsetWidth/2), (dragEl.offsetHeight/2))
  }

  // specify things about this draggable, such as the items within the
  // HeapList that are actually draggable, the fact that we dont want to
  // sort, our animation speed, ghost class for the draggable, setting the
  // draggable image with setData and more
  Sortable.create(heapList, {
    draggable: '.sourceItem',
    sort: false,
    animation: 100,
    group: 'SourceMvmt',
    pull: true,
    ghostClass: 'highlightGhost',
    setData,
    scroll: true,
    scrollSensitivity: 300,
    scrollSpeed: 10,
  })
}


// the initializing function also takes a callback to invoke when we add
// something to the trash
export function initializeSourceTrashDraggables(cb) {
  // grab the relevant component
  const sourceTrash = document.getElementById('SourceTrash')

  // to call when something is dropped in trash
  function onTrash(evt) {
    const sourceId = evt.item.attributes['data-id'].value
    // can remove from the dom
    sourceTrash.removeChild(evt.item)
    // now delete using the callback
    cb(sourceId)
  }
  // creates sourceTrash dom element as a 'draggable', and specifies that
  // things of group 'SourceMvmt' can put things into it. in reality
  // the trash will only be accepting things and will not be moved itself
  Sortable.create(
    sourceTrash,
    {
      group: 'SourceMvmt',
      put: ['SourceMvmt'],
      onAdd: onTrash,
    }
  )
}
