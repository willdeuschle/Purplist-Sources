import React, { Component } from 'react'
import { Link } from 'react-router'

import '../styles/UserSearchDisplay.css'

export default class UserSearchDisplay extends Component {
  renderSearchUsers() {
    if (this.props.currentlySearching) {
      return this.props.searchUsers.map((searchUser) => {
        return (
          <Link
            to={`/${searchUser.username}/`}
            key={searchUser.id}
            className='searchUser'
            onClick={this.props.removeDropdown}
          >
            {searchUser.name}
          </Link>
        )
      })
    }
    return null
  }

  render() {
    console.log("what props do I get her", this.props)
    return (
      <div className='UserSearchDisplay'>
        {this.renderSearchUsers()}
      </div>
    )
  }
}

UserSearchDisplay.defaultProps = {
  searchUsers: [],
}
