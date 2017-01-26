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
        if (newProps.user) {
            this.setState({
                name: newProps.user.nickname,
            })
        }
    }

    renderHeapList() {
        if (this.props.user) {
            return this.props.user.heapList.sources.map((sourceItem) => {
                return (
                    <div key={sourceItem.id} className='sourceItem'>
                        <img className='sourceImg' src={sourceItem.faviconUrl}/>
                        {sourceItem.title}
                    </div>
                )
            })
        }
    }

    render() {
        return (
            <div className='reactive-base'>
                hello {this.state.name || 'person'}, this is a protected page
                <a className='logout-button' href='logout'>Logout</a>
                {this.renderHeapList()}
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
            heapList {
                name,
                sources {
                    id,
                    title,
                    sourceUrl,
                    faviconUrl,
                },
            },
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
const props = ({ ownProps, data: { user } }) => ({
    user: user,
})

// export the 'connected' component
export const AppWithData = graphql(myQuery, {
    options,
    props,
})(App)
