import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

import { deleteSourceList } from './mutations.js'
import { DeleteListTip } from './constants.js'


function DeleteSourceList({ canDelete, deleteSourceList }) {
  return (
    <span>
      <i
        className={classNames({
          'fa fa-trash-o ListTitleControl': true,
          'no-delete': !canDelete,
        })}
        onClick={canDelete ? deleteSourceList : null}
        data-place={'bottom'}
        data-effect='solid'
        data-tip={DeleteListTip}
        data-for='DeleteListTip'
      />
      <ReactTooltip id='DeleteListTip' />
    </span>
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
