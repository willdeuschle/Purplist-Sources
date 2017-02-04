import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Router, Route, browserHistory } from 'react-router'

const client = new ApolloClient()

import App from './App.js'


ReactDOM.render(

  <ApolloProvider client={client}>
    <Router history={browserHistory}>
      <Route path={'/:username/'} component={App} />
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
)
