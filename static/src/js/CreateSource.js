import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { createSource } from './mutations.js'


class CreateSource extends Component {
  constructor() {
    super()
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
      <div className='new-source-wrapper'>
        <input
          ref={node => this._input=node}
          className='new-source-url'
        />
        <div onClick={this.createSource}>
          Submit
        </div>
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
