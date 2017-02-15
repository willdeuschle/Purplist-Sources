import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import ReactTooltip from 'react-tooltip'

import '../styles/CreateSource.css'

import { createSource } from './mutations.js'
import { CreateSourceTip } from './constants.js'


class CreateSource extends Component {
  constructor() {
    super()
    this.createSource = this.createSource.bind(this)
  }

  createSource() {
    if (this._input.value) {
      this.props.createSource(this._input.value)
      this._input.value = ''
    }
  }

  // need to style this still
  render() {
    return (
      <div className='CreateSource'>
        <input
          ref={node => this._input=node}
          className='new-source-url'
          placeholder='Add new source url here...'
        />
        <i
          onClick={this.createSource}
          className='fa fa-plus create-new-source'
          data-place={'bottom'}
          data-effect='solid'
          data-tip={CreateSourceTip}
          data-for='CreateSourceTip'
        />
        <ReactTooltip id='CreateSourceTip' />
      </div>
    )
  }
}

// configure our mutation so that we can call it with a single argument
const props = ({ ownProps, mutate }) => {
  return ({
    createSource: (sourceUrl) => {
      mutate({ variables: { userId: ownProps.userId, sourceUrl, sourceListId: ownProps.sourceListId }})
    },
  })
}

export default graphql(createSource, { props })(CreateSource)
