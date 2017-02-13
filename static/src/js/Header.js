import React, { Component } from 'react'

import '../styles/Header.css'
import SearchBarWrapper from './SearchBarWrapper.js'


export default class Header extends Component {
  render() {
    return (
      <div className='Header'>
        <SearchBarWrapper />
      </div>
    )
  }
}
