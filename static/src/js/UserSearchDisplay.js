import React, { Component } from 'react'
import { Link } from 'react-router'

import '../styles/UserSearchDisplay.css'

export default class UserSearchDisplay extends Component {
  renderSearchUsers() {
    return this.props.searchUsers.map((searchUser) => {
      return (
        <Link
          to={`/${searchUser.username}/`}
          key={searchUser.id}
          className='searchUser'
          onClick={this.props.removeDropdown}
        >
          {window.cu_id === parseInt(searchUser.id) ?
              `${searchUser.name} (You)` :
              searchUser.name
          }
        </Link>
      )
    })
  }

  render() {
    console.log("what props do I get her", this.props)
    // if we are currently searching and have matches
    if (this.props.currentlySearching && this.props.searchUsers.length) {
      return (
        <div className='UserSearchDisplay'>
          {this.renderSearchUsers()}
        </div>
      )
    }
    return null
  }
}

UserSearchDisplay.defaultProps = {
  searchUsers: [],
}
