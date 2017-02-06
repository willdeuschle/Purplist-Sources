import React, { Component } from 'react'
import { graphql } from 'react-apollo'


function DeleteSourceList({ sourceListId, deleteSourceList }) {
  return (
    <i
      className='fa fa-trash-o ListTitleControl'
      onClick={deleteSourceList}
    />
  )
}
