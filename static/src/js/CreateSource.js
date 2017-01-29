import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import '../styles/CreateSource.css'

import { createSource } from './mutations.js'


class CreateSource extends Component {
  constructor() {
    super()
    this.state = {
      inputVisible: false,
    }
    this.createSource = this.createSource.bind(this)
  }

  createSource() {
    if (this._input.value) {
      this.props.createSource(this._input.value)
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
        />
      </div>
    )
  }
}

// configure our mutation so that we can call it with a single argument
const props = ({ mutate }) => {
  return ({
    createSource: (sourceUrl) => {
      mutate({ variables: { cu_id: window.cu_id, sourceUrl } })
        .then((resp) => console.log("what is resp", resp))
    },
  })
}

export default graphql(createSource, { props })(CreateSource)
