import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import ReactTooltip from 'react-tooltip'

import { createSourceList } from './mutations.js'
import '../styles/CreateSourceList.css'
import { CreateListTip } from './constants.js'

class CreateSourceList extends Component {
  constructor() {
    super()
    this.createSourceList = this.createSourceList.bind(this)
  }

  createSourceList() {
    if (this._input.value) {
      this.props.createSourceList(this._input.value)
      this._input.value = ''
    }
  }

  render() {
    if (window.cu_id === parseInt(this.props.userId)) {
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
            data-place={'bottom'}
            data-effect='solid'
            data-tip={CreateListTip}
            data-for='CreateListTip'
          />
          <ReactTooltip id='CreateListTip' />
        </div>
      )
    }
    return null
  }
}

const props = ({ ownProps, mutate }) => {
  return ({
    createSourceList: (sourceListName) => {
      mutate({ variables: { userId: ownProps.userId, sourceListName, }})
    }
  })
}

export default graphql(createSourceList, { props })(CreateSourceList)
