import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import classNames from 'classnames'

import { deleteSourceList } from './mutations.js'


function DeleteSourceList({ canDelete, deleteSourceList }) {
  return (
    <i
      className={classNames({
        'fa fa-trash-o ListTitleControl': true,
        'no-delete': !canDelete,
      })}
      onClick={canDelete ? deleteSourceList : null}
    />
  )
}

const props = ({ ownProps: { userId, sourceListId }, mutate }) => {
  return {
    deleteSourceList: () => mutate({ variables: { userId, id: sourceListId }})
      .then(resp => window.location = `/${resp.data.deleteSourceList.userUsername}/`)
  }
}

export default graphql(deleteSourceList, {
  props,
})(DeleteSourceList)
