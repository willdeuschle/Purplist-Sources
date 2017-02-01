import Sortable from 'sortablejs'


export default function initializeDraggables() {
    const sourceTrash = document.getElementById('SourceTrash')
    const heapList = document.getElementById('HeapList')
    const sourceListBlocks = document.getElementsByClassName('SourceListBlock')

    function onListAdd(evt) {
      console.log("blarg", evt)
      console.log("to do something here in onListAdd", evt.item.attributes['data-id'].nodeValue)
      evt.to.removeChild(evt.item)
    }

    function createSourceListTargets() {
        Array.prototype.forEach.call(sourceListBlocks, (sourceListBlock) => Sortable.create(sourceListBlock, {group: 'SourceMvmt', put: ['SourceMvmt'], ghostClass: 'highlightGhost', onAdd: onListAdd}))
    }
    setTimeout(createSourceListTargets, 500)


    function onTrash(evt) {
      console.log("to do something here in onTrash", evt.item.attributes['data-id'].nodeValue)
      // can remove from the dom
      sourceTrash.removeChild(evt.item)
      // need to delete things here
    }
    function onStart(evt) {
      console.log("what have at start", evt)
    }
    function setData(dataTransfer, dragEl) {
      console.log("what in dataTransfer", dataTransfer, dataTransfer.setDragImage, dragEl, dragEl.offsetWidth)
      dataTransfer.setDragImage(dragEl, (dragEl.offsetWidth/2), (dragEl.offsetHeight/2))
    }
    Sortable.create(sourceTrash, {group: 'SourceMvmt', put: ['SourceMvmt'], onAdd: onTrash})
    Sortable.create(heapList, {
      draggable: '.sourceItem',
      sort: false,
      animation: 100,
      group: 'SourceMvmt',
      pull: true,
      ghostClass: 'highlightGhost',
      onStart,
      setData,
      scroll: true,
      scrollSensitivity: 300,
      scrollSpeed: 10,
      onMove: function (evt) {
        console.log("what have", evt, sourceListBlocks)
        // highlight SourceTrash if it's getting hovered
        //if (SourceTrash === evt.to) {
          //Sortable.utils.toggleClass(evt.to, 'highlight', true);
        //}
      },
      onEnd: function(evt) {
        // remove higlighting
        //sourceTrash.className = sourceTrash.className.replace('highlight', '')
      },
    })
}
