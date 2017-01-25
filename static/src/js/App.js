import React, { Component } from 'react'
import ApolloClient from 'apollo-client'
import { ApolloProvider, graphql } from 'react-apollo'
import gql from 'graphql-tag'

// set up our ApolloClient for data management
const client = new ApolloClient()

// styling for this component
import '../styles/App.css'


// our base component
class App extends Component {
    constructor() {
        super()
        this.state = {
            name: null,
            sourceTitle: null,
        }
    }

    componentDidMount() {
        console.log("now need to access some datas", cu_id)
    }

    componentWillReceiveProps(newProps) {
        console.log("newProps", newProps)
        if (newProps.user && newProps.sources) {
            console.log("hi")
            this.setState({
                name: newProps.user.nickname,
                sourceTitle: newProps.sources[0].title,
            })
        }
    }

    render() {
        return (
            <div className='reactive-base'>
                hello {this.state.name || 'person'}, this is a protected page
                here are some of your sources: {this.state.sourceTitle}
                <a className='logout-button' href='logout'>Logout</a>
            </div>
        )
    }
}

export default App

// query for Apollo to execute
// we could access all of the sources from the
// user itself, but this creates a flatter
// data structure
const myQuery = gql`
    query ($cu_id: ID!) {
        user(userId: $cu_id) {
            nickname,
        },
        sources(userId: $cu_id) {
            title,
            faviconUrl,
            sourceUrl,
        },
    }
`

// the variables we want to use with the query
const options = {
    variables: {
        cu_id: window.cu_id,
    },
}

// potentially rename our props in the future
const props = ({ ownProps, data: { user, sources } }) => ({
    user: user,
    sources: sources,
})

// export the 'connected' component
export const AppWithData = graphql(myQuery, {
    options,
    props,
})(App)
