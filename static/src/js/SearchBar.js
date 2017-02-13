import React, { Component } from 'react'

import '../styles/SearchBar.css'


export default class SearchBar extends Component {
  render() {
    return (
      <div className='SearchBar'>
        <i
          className='SearchBar-icon fa fa-search'
        />
        <input
          className='SearchBar-input'
          placeholder='Search for other users...'
        />
      </div>
    )
  }
}
