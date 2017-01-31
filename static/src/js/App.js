import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Sortable from 'sortablejs'

// styling for this component
import '../styles/App.css'
// the Header for the page
import Header from './Header.js'
// the SourceTools component
import SourceTools from './SourceTools.js'
// the HeapList component
import HeapList from './HeapList.js'
// the SourceListColumn component
import SourceListColumn from './SourceListColumn.js'
// the SubHeader component
import SubHeader from './SubHeader.js'


// our base component
class App extends Component {
  componentDidMount() {
    console.log("Mounted");
    const sourceTrash = document.getElementById('SourceTrash')
    const heapList = document.getElementById('HeapList')
    const sourceListBlocks = document.getElementsByClassName('SourceListBlock')

    function onListAdd(evt) {
      console.log("to do something here in onListAdd", evt.item.attributes['data-id'].nodeValue)
    }

    let foo = () => {
        console.log("fek", sourceListBlocks)
        Array.prototype.forEach.call(sourceListBlocks, (sourceListBlock) => Sortable.create(sourceListBlock, {group: 'SourceMvmt', put: ['SourceMvmt'], onAdd: onListAdd}))
    }
    //foo()
    setTimeout(() => foo(), 500)


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
      ghostClass: 'garbageGhost',
      onStart,
      setData,
      scroll: true,
      scrollSensitivity: 300,
      scrollSpeed: 10,
    })
  }

  componentWillUnmount() {
    console.log("werird")
  }

  render() {
    return (
      <div className='reactive-base'>
        <Header />
        <div className='page-content-subheader'>
          <SubHeader />
        </div>
        <div className='page-content'>
            <div className='SourceTools-wrapper content-thirds'>
              <SourceTools />
            </div>
            <div className='HeapList-wrapper content-thirds'>
              <HeapList />
            </div>
            <div className='SourceListColumn-wrapper content-thirds'>
              <SourceListColumn />
            </div>
        </div>
        <a className='logout-button' href='logout'>Logout</a>
      </div>
    )
  }
}

export default App

