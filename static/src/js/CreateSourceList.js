import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { createSourceList } from './mutations.js'
import '../styles/CreateSourceList.css'

class CreateSourceList extends Component {
  constructor() {
    super()
    this.createSourceList = this.createSourceList.bind(this)
  }

  createSourceList() {
    console.log("what have")
    if (this._input.value) {
      this.props.createSourceList(this._input.value)
      this._input.value = ''
    }
  }

  render() {
    return (
      <div className='CreateSourceList'>
        <input
          ref={node => this._input = node}
          className='new-source-list-name'
          placeholder='Create new list...'
        />
        <i
          onClick={this.createSourceList}
          className='fa fa-plus create-new-source-list'
        />
      </div>
    )
  }
}

const props = ({ ownProps, mutate }) => {
  return ({
    createSourceList: (sourceListName) => {
      mutate({ variables: { userId: ownProps.userId, sourceListName, }})
        .then((resp) => console.log("what did we create", resp))
    }
  })
}

export default graphql(createSourceList, { props })(CreateSourceList)
