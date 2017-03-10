import os
import cgi
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, login_required, logout_user, login_user, current_user
from flask import Flask, render_template, url_for, redirect, flash, request, make_response, jsonify, session
from oauth import OAuthSignIn
from flask_graphql import GraphQLView


app = Flask(__name__, static_folder='./static/dist', template_folder='./static/src')
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# we can't import User until the db is set up
from models import User, Source, SourceList

# we cant import schema until the models are set up, and they need the db
from schema import schema, GraphqlAuthorizationMiddleware
# app.add_url_rule(
    # '/graphql',
    # view_func=GraphQLView.as_view(
        # 'graphql',
        # schema=schema,
        # context={},
        # graphiql=app.config['DEVELOPMENT'] == True,
        # batch=app.config['DEVELOPMENT'] != True,
    # )
# )

# need to add my setup_functions
from python_graphql_subscriptions import SubscriptionManager, PubSub
pubsub = PubSub()
# add our setup function of interest - will eventually want to separate this
# out from what we are doing in this file
setup_functions = {}

# determine who to send this update to
def filter_source_added(root_value, context, **variables):
    if not variables.get('user_id', None):
        raise ValueError('No user id passed as variable')
    else:
        return root_value.user_id == int(variables['user_id'])

# configure sourceAdded subscription
def sourceAdded(options, args, subscription_name):
    return {'sourceAdded': {'filter': filter_source_added}}

setup_functions['sourceAdded'] = sourceAdded # add the sourceAdded subscription
subscription_manager = SubscriptionManager(schema, pubsub, setup_functions)

# from transport_websockets.transport import SubscriptionServer
from flask_graphql_subscriptions_transport import SubscriptionServer
subscription_server = SubscriptionServer(app,
                                         subscription_manager)

# manages user authentication and sesions
lm = LoginManager(app)
@lm.user_loader
def load_user(id):
    try:
        return User.query.get(int(id))
    except:
        return None

@app.route('/graphql', methods=['GET', 'POST'])
@login_required
def graphql():
    return GraphQLView.as_view(
        'graphql',
        schema=schema,
        middleware=[GraphqlAuthorizationMiddleware()],
        context={'current_user': current_user},
        graphiql=app.config['DEVELOPMENT'],
    )()


# this route is to handle unauthorized people, send them to login
# and store where they were trying to go as the next option
@lm.unauthorized_handler
def unauthorized():
    session['next'] = request.url
    return redirect(url_for('login'))

# this route is for authorizing users
@app.route('/authorize/<provider>')
def authorize(provider):
    # redirect if they are already logged in
    if not current_user.is_anonymous:
        return redirect(url_for('index', username=current_user.username))
    # get the kind of provider selected
    oauth = OAuthSignIn.get_provider(provider)
    # use their authorize method
    return oauth.authorize()

# this is the callback invoked by the provider after authenticating
@app.route('/oauth_callback/<provider>')
def oauth_callback(provider):
    # check to see if the user is logged in
    if not current_user.is_anonymous:
        # if we have a 'next' option
        next_url = session.pop('next', None)
        if next_url:
            return redirect(next_url)
        return redirect(url_for('index', username=current_user.username))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, name, email = oauth.callback()
    if social_id is None:
        flash('Authentication failed')
        # returning here to the login page. might want to have the index
        # page have a button that asks for them to login
        return redirect(url_for('login'))
    # get the user
    user = User.query.filter_by(social_id=social_id).first()
    # create them if this is their first time
    # also create their heap list
    if not user:
        user = User.generate_user(social_id=social_id, name=name, email=email)
        heap_list = SourceList(name="Heap", user=user, is_heap=True)
        db.session.add(user)
        db.session.add(heap_list)
        db.session.commit()
    # the 'True' tells our login manager to remember the user
    login_user(user, True)
    # if we have a 'next' option
    next_url = session.pop('next', None)
    if next_url:
        return redirect(next_url)
    return redirect(url_for('index', username=user.username))


@app.route('/download/', methods=['GET', 'POST'])
@app.route('/download/<sourceListId>/', methods=['GET', 'POST'])
@login_required
def download_list(sourceListId=None):
    # get the given source list or use the heap
    if sourceListId:
        sl = SourceList.query.get(sourceListId)
    else:
        sl = SourceList.query.filter_by(user=current_user, is_heap=True).first()
    text = '{0}: {1}\n'.format(current_user.name, sl.name)
    for idx, source in enumerate(sl.sources):
        text += '{0}) {1}\n'.format(idx, source.title)
    response = make_response(text)
    content_disp = 'attachment; filename={0}'.format(sl.name)
    response.headers['Content-Disposition'] = content_disp
    return response


# this is the landing page, don't need to be logged in to get here
@app.route('/', methods=['GET', 'POST'])
@app.route('/login/', methods=['GET', 'POST'])
def login():
    return render_template('login.html', title='Login')


# this logs you out and returns you to the landing page
@app.route('/logout/')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


# for our chrome extension
@app.route('/chromeext/', methods=['GET', 'POST'])
def chromeext():
    user_id = getattr(current_user, 'id', None)
    if not user_id:
        return jsonify({'logged_in': False})
    else:
        # first we need to add this source to their heap
        # get their heap
        source_list = SourceList.query.filter_by(user=current_user, is_heap=True).first()
        payload = request.get_json()
        s = Source(user=current_user,
                   source_list=source_list,
                   title=payload['title'],
                   favicon_url=payload['favicon_url'],
                   source_url=payload['source_url'])
        db.session.add(s)
        db.session.commit()

        # use subscriptions
        pubsub.publish('sourceAdded', s)

        return jsonify({'logged_in': True})


# this is the index page
@app.route('/<username>/', methods=['GET', 'POST'])
@app.route('/<username>/<sourceListId>/', methods=['GET', 'POST'])
@login_required
def index(username, sourceListId=None):
    return render_template('index.html')


if __name__ == '__main__':
    subscription_server.socketio.run(app)
    # app.run()
