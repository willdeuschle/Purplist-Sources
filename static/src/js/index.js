import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Router, Route, browserHistory } from 'react-router'

const networkInterface = new createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
})

const client = new ApolloClient({ networkInterface })

import App from './App.js'
import PageContent from './PageContent.js'


ReactDOM.render(
  <ApolloProvider client={client}>
    <Router history={browserHistory}>
      <Route path={'/'} component={App}>
        <Route path={'/:username/(:sourceListId)'} component={PageContent} />
      </Route>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
)
