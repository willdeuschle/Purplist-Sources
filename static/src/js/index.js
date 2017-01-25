import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

const client = new ApolloClient()

import { AppWithData } from './App.js'


ReactDOM.render(
    <ApolloProvider client={client}>
        <AppWithData />
    </ApolloProvider>,
    document.getElementById('root')
)
