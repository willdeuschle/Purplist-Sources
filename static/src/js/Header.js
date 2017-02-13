import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'

import '../styles/Header.css'
import SearchBarWrapper from './SearchBarWrapper.js'
import {
  HomeTip,
  ChromeExtTip,
} from './constants.js'



export default class Header extends Component {
  render() {
    return (
      <div className='Header'>
        <a
          href={'/'}
          className='fa fa-home return-home'
          data-place={'right'}
          data-effect='solid'
          data-tip={HomeTip}
          data-for='HomeTip'
          />
        <ReactTooltip id='HomeTip' />
        <SearchBarWrapper />
        <a
          href={'https://www.google.com/'}
          target='_blank'
          className='fa fa-google to-chrome-ext'
          data-place={'left'}
          data-effect='solid'
          data-tip={ChromeExtTip}
          data-for='ChromeExtTip'
        />
        <ReactTooltip id='ChromeExtTip' />
      </div>
    )
  }
}
