import React, { Component } from 'react'

import SearchBar from './SearchBar.js'

export default class SearchBarWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: ''
    }
    this.inputValueChanged = this.inputValueChanged.bind(this)
    this.clearInput = this.clearInput.bind(this)
  }

  inputValueChanged(e) {
    this.setState({
      inputValue: e.target.value,
    })
  }

  clearInput() {
    this.setState({
      inputValue: '',
    })
  }

  render() {
    return (
      <SearchBar
        value={this.state.inputValue}
        inputValueChanged={this.inputValueChanged}
        clearInput={this.clearInput}
      />
    )
  }
}
