import React, { Component } from 'react'

import '../styles/Header.css'
import SearchBar from './SearchBar.js'


export default class Header extends Component {
  render() {
    return (
      <div className='Header'>
        <SearchBar />
      </div>
    )
  }
}
