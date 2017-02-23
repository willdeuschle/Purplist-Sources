import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Router, Route, browserHistory } from 'react-router'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

const networkInterface = new createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
})

SubscriptionClient.prototype.sendMessage = function (message) {
  switch (this.client.io.readyState) {
    case this.client.io.OPEN:
      this.client.send(JSON.stringify(message));
      break;
    case this.client.io.CONNECTING:
      this.unsentMessagesQueue.push(message);
      break;
    case this.client.io.CLOSING:
    case this.client.io.CLOSED:
    default:
      if (!this.reconnecting) {
        throw new Error('Client is not connected to a websocket.');
      }
  }
};

const GRAPHQL_SUBSCRIPTIONS = 'graphql-subscriptions';
const SUBSCRIPTION_MESSAGE = 'subscription_message';
const SUBSCRIPTION_FAIL = 'subscription_fail';
const SUBSCRIPTION_END = 'subscription_end';
const SUBSCRIPTION_DATA = 'subscription_data';
const SUBSCRIPTION_START = 'subscription_start';
const SUBSCRIPTION_SUCCESS = 'subscription_success';
const KEEPALIVE = 'keepalive';
const INIT = 'init';
const INIT_SUCCESS = 'init_success';
const INIT_FAIL = 'init_fail';

// had to override the connect function because socketio and
// websockets use different connecting methods
SubscriptionClient.prototype.connect = function(isReconnect=false) {
  this.client = new this.wsImpl(this.url, GRAPHQL_SUBSCRIPTIONS);

  //this.client.onopen = () => {
  this.client.io.addEventListener('open', () => {
    this.eventEmitter.emit(isReconnect ? 'reconnect' : 'connect');
    this.reconnecting = false;
    this.backoff.reset();
    Object.keys(this.reconnectSubscriptions).forEach((key) => {
      const { options, handler } = this.reconnectSubscriptions[key];
      this.subscribe(options, handler);
    });
    this.unsentMessagesQueue.forEach((message) => {
      this.client.send(JSON.stringify(message));
    });
    this.unsentMessagesQueue = [];

    // Send INIT message, no need to wait for connection to success (reduce roundtrips)
    this.sendMessage({type: INIT, payload: this.connectionParams});
  });

  this.client.io.addEventListener('close', () => {
    this.eventEmitter.emit('disconnect');

    this.tryReconnect();
  });

  this.client.addEventListener('error', () => {
    // Capture and ignore errors to prevent unhandled exceptions, wait for
    // onclose to fire before attempting a reconnect.
  });

  this.client.addEventListener(SUBSCRIPTION_MESSAGE, ({ data }) => {
    console.log("success", data)
    let parsedMessage
    try {
      parsedMessage = JSON.parse(data);
      console.log("parsedMessage", parsedMessage)
    } catch (e) {
      throw new Error(`Message must be JSON-parseable. Got: ${data}`);
    }
    const subId = parsedMessage.id;
    if ([KEEPALIVE, INIT_SUCCESS, INIT_FAIL].indexOf(parsedMessage.type) === -1 && !this.subscriptions[subId]) {
      this.unsubscribe(subId);
      return;
    }

    // console.log('MSG', JSON.stringify(parsedMessage, null, 2));
    switch (parsedMessage.type) {
      case INIT_FAIL:
        if (this.connectionCallback) {
          this.connectionCallback(parsedMessage.payload.error);
        }
        break;
      case INIT_SUCCESS:
        if (this.connectionCallback) {
          this.connectionCallback();
        }
        break;
      case SUBSCRIPTION_SUCCESS:
        delete this.waitingSubscriptions[subId];

        break;
      case SUBSCRIPTION_FAIL:
        this.subscriptions[subId].handler(this.formatErrors(parsedMessage.payload.errors), null);
        delete this.subscriptions[subId];
        delete this.waitingSubscriptions[subId];

        break;
      case SUBSCRIPTION_DATA:
        if (parsedMessage.payload.data && !parsedMessage.payload.errors) {
            this.subscriptions[subId].handler(null, parsedMessage.payload.data);
        } else {
          this.subscriptions[subId].handler(this.formatErrors(parsedMessage.payload.errors), null);
        }
        break;

      case KEEPALIVE:
        break;

      default:
        throw new Error('Invalid message type!');
    }
  });
}

// had to override this because socketio and Websockets have a slightly
// different interface and the subclient uses that interface
class modIO extends io {
  constructor(args) {
    super(args)
    this.io.OPEN = 'open'
    this.io.CONNECTING = 'opening'
    this.io.CLOSING = 'closing'
    this.io.CLOSED = 'closed'
    //this.readyState = this.io.readyState
  }
}

const wsClient = new SubscriptionClient('http://localhost:5000/ws', {
    reconnect: true,
    connectionParams: {
    }
  },
  // need use socket.io and not websockets
  modIO
)

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

// for cache updates
const dataIdFromObject = (result) => {
  if (result.id && result.__typename) {
    return result.__typename + result.id
  }
  return null
}

//const client = new ApolloClient({
  //networkInterface,
  //dataIdFromObject,
//})

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject,
})

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
