#
# implements the transport drop-in for python-graphql-subscriptions
#

# the websocket plugin we are using
from flask_socketio import SocketIO
from flask import request
import cgi
import json

from . message_types import (
  SUBSCRIPTION_MESSAGE,
  SUBSCRIPTION_FAIL,
  SUBSCRIPTION_DATA,
  SUBSCRIPTION_START,
  SUBSCRIPTION_END,
  SUBSCRIPTION_SUCCESS,
  KEEPALIVE,
  INIT,
  INIT_FAIL,
  INIT_SUCCESS,
)

class SubscriptionServer(object):
    def __init__(self,
                 app,
                 subscription_manager,
                 on_subscribe=None,
                 on_unsubscribe=None,
                 on_connect=None,
                 on_disconnect=None,
                 keep_alive=None,
                 **socket_options):

        print("INITIALIZING")
        # initialize
        self.subscription_manager = subscription_manager
        self.connection_subscriptions = {}
        # these are customizations, going to worry about these last
        self.on_subscribe = on_subscribe
        self.on_unsubscribe = on_subscribe
        self.on_connect = on_connect
        self.on_disconnect = on_disconnect
        self.keep_alive = keep_alive

        # initialize websocket, and init with our app
        self.socketio = SocketIO()
        self.socketio.init_app(app)

        # to run on connection
        # TODO: make sure the request coming to this websocket is for graphql_subscriptions
        def socket_connect():
            print("need to eventually validate request method", request.method, request.sid)
            self.socketio.emit('msg', {'data': 'hi'}, namespace='/ws')
        self.socketio.on_event('connect', socket_connect, namespace='/ws')

        # to run on disconnect
        # TODO: clean up the subscriptions
        def socket_disconnect():
            """
            cleans up all of the existing subscriptions
            """
            print("DISCONNECTING", request)
            self.socketio.emit('msg', {'data': 'bye'}, namespace='/ws')
        self.socketio.on_event('disconnect', socket_disconnect, namespace='/ws')

        # run on a message
        self.socketio.on_event('message', self.on_message, namespace='/ws')

    def unsubscribe(self, sub_id):
        print("UNSUBSRIBING")
        # delegate to our subscription_manager
        self.subscription_manager.unsubscribe(sub_id)
        # also need to call the on_unsubscribe custom handler
        if self.on_unsubscribe:
            self.on_unsubscribe(sub_id)

    def on_message(self, message):
        """
        executes on message receipt
        handles the several reasons we would get a message:
        - INIT
        - SUBSCRIPTION_START
        - SUBSCRIPTION_END
        """
        print("MESSAGE")
        # this was what we were doing when we were just testing to see that it could work
        # print(message['listen'])
        # self.socketio.emit('listen',
                          # {'data': cgi.escape(message['listen'])},
                          # namespace="/ws",
                          # room=request.sid)

        # need to make a closure for this request id
        request_id = request.sid

        # first parse our message
        try:
            parsed_message = json.loads(message)
        except Exception as e:
            # send failure
            self.send_subscription_fail(None, {'errors': e}, request_id)
            return

        sub_id = parsed_message['id']

        # handle our different message types

        # INIT case
        if parsed_message['type'] == INIT:
            print("INIT")
            try:
                # if we have some custom set-up
                # I think this is to filter some things out on INIT
                on_connect_context = True
                if self.on_connect:
                    on_connect_context = self.on_connect(parsed_message['payload'])

                if not on_connect_context:
                    raise ValueError('Prohibited connection!')

                self.send_init_result(INIT_SUCCESS, None, request_id)

            except Exception as e:
                self.send_init_result(INIT_FAIL, {'errors': e}, request_id)
            return


        # SUBSCRIPTION_START case
        elif parsed_message['type'] == SUBSCRIPTION_START:

            base_params = {
                 'query': parsed_message['query'],
                 'variables': parsed_message['variables'],
                 'operation_name': parsed_message.get('operation_name', None),
                 # TODO: figure out how to manage context
                 'context': {},
                 'format_response': None,
                 'format_error': None,
                 'callback': None,
            }

            try:
                # if we have a custom on_subscribe
                if self.on_subscribe:
                    base_params = self.on_subscribe(parsed_message, base_params)

                # if we already have a subscription with this id unsub first
                # unclear if this works or not
                if self.connection_subscriptions.get(sub_id, None):
                    self.unsubscribe(self.connection_subscriptions[sub_id])
                    self.connection_subscriptions.pop(sub_id)

                if not isinstance(base_params, dict):
                    error = 'Invalid params returned from on_subscribe - return values must be an object'
                    self.send_subscription_fail(sub_id, {'errors': error}, request_id)
                    raise ValueError(error)

                # create a callback for sending data
                # error could be runtime or object with errors
                # result is GraphQL ExecutionResult
                # should also think about passing the request through to here in case we error?
                def callback(error=None, result=None):
                    print("in callback", error, result)
                    if not error:
                        self.send_subscription_data(sub_id, {'data': result.data}, request_id)
                    elif isinstance(error, dict) and 'errors' in error:
                        self.send_subscription_data(sub_id, {'errors': error['errors']}, request_id)
                    else:
                        # this is a runtime error
                        self.send_subscription_fail(sub_id, {'errors': error}, request_id)

                base_params['callback'] = callback

                # get back the subscription id of the subscription_manager
                graphql_sub_id = self.subscription_manager.subscribe(**base_params)

                self.connection_subscriptions[sub_id] = graphql_sub_id

                self.send_subscription_success(sub_id, request_id)
            # need to work on error handling
            except Exception as e:
                print("what errors", e)
                # is this the right way to do this?
                # if e.get('errors', None):
                if isinstance(e, dict):
                    # these are graphql errors
                    self.send_subscription_fail(sub_id, {'errors': e.errors}, request_id)
                else:
                    # this is a runtime error, is this the right way to handle it?
                    self.send_subscription_fail(sub_id, {'errors': e}, request_id)
            return

        # SUBSCRIPTION_END case
        elif parsed_message['type'] == SUBSCRIPTION_END:
            # just get the sub_id, unsub, delete it
            if self.connection_subscriptions.get(sub_id, None):
                self.unsubscribe(self.connection_subscriptions[sub_id])
                self.connection_subscriptions.pop(sub_id)
            return

        # otherwise fail
        else:
            self.send_subscription_fail(sub_id, {'errors': {'message': 'Invalid message type'}}, request_id)
            return

    ### FIRST THING TO DO TODAY: figure out how to store the sid so that we can send it on appropriately
    def send_subscription_data(self, sub_id, payload, request_id):
        """
        send update to the appropriate client via the session id
        """
        print("sending data", payload, request.__dict__)
        message = {
            'type': SUBSCRIPTION_DATA,
            'id': sub_id,
            'payload': payload,
        }
        self.socketio.emit(SUBSCRIPTION_MESSAGE,
                          {'data': json.dumps(message)},
                          namespace='/ws',
                          room=request_id)

    def send_subscription_fail(self, sub_id, payload, request_id):
        """
        alert client to failure in setting up subscription
        """
        error_message = str(payload['error'])
        message = {
            'type': SUBSCRIPTION_FAIL,
            'id': sub_id,
            'payload': error_message,
        }
        self.socketio.emit(SUBSCRIPTION_MESSAGE,
                          {'data': json.dumps(message)},
                          namespace='/ws',
                          room=request_id)

    def send_subscription_success(self, sub_id, request_id):
        """
        notify client of success in setting up subscription
        """
        print("SUCCESS", sub_id, request.sid)
        message = {
            'type': SUBSCRIPTION_SUCCESS,
            'id': sub_id,
        }
        self.socketio.emit(SUBSCRIPTION_MESSAGE,
                          {'data': json.dumps(message)},
                          namespace='/ws',
                          room=request_id)

    def send_init_result(self, message_type, payload, request_id):
        message = {
            'type': message_type,
            'payload': payload,
        }
        self.socketio.emit(SUBSCRIPTION_MESSAGE,
                          {'data': json.dumps(message)},
                          namespace='/ws',
                          room=request_id)
        # self.socketio.emit('init_result',

    # going to worry about this later
    def send_keep_alive(self):
        pass
