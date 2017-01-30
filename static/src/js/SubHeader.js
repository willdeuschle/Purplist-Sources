import React, { Component } from 'react'

import '../styles/SubHeader.css'


class SubHeader extends Component {
  render() {
    return (
      <div className='SubHeader'>
        <div className='IndividualStats'>
          stats
        </div>
        <div className='ListTitleAndTools'>
          this is the subheader
        </div>
        <div className='CreateList'>
          Make new lists
        </div>
      </div>
    )
  }
}

export default SubHeader
