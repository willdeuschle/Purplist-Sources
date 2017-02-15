import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import classNames from 'classnames'

import '../styles/SearchBar.css'
import { userSearchQuery } from './queries.js'
import UserSearchDisplay from './UserSearchDisplay.js'


class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentlySearching: false,
    }
    this.removeDropdown = this.removeDropdown.bind(this)
  }

  removeDropdown() {
    this.setState({currentlySearching: false})
  }

  render() {
    return (
      <div className='SearchBar'>
        <i
          className='SearchBar-icon fa fa-search'
        />
        <input
          className='SearchBar-input'
          placeholder='Search for other users...'
          value={this.props.value}
          onChange={this.props.inputValueChanged}
          onFocus={() => this.setState({currentlySearching: true})}
        />
        <i
          className={classNames({
            'fa fa-times clearSearch': true,
            'hide': !this.state.currentlySearching,
          })}
          onClick={() => {
            this.removeDropdown()
            this.props.clearInput()
          }}
        />
        <UserSearchDisplay
          currentlySearching={this.state.currentlySearching}
          searchUsers={this.props.searchUsers}
          removeDropdown={this.removeDropdown}
        />
      </div>
    )
  }
}

const options = (ownProps) => {
  return {
    variables: {
      name: ownProps.value,
    }
  }
}

const props = ({ownProps, data: { searchUsers, loading, refetch, error }}) => {
  return {
    searchUsers,
    loading,
    refetch,
    error,
  }
}

export default graphql(userSearchQuery, {
  options,
  props,
  skip: (ownProps) => {
    const toSkip = (ownProps.value === '')
    return toSkip
  },
})(SearchBar)
