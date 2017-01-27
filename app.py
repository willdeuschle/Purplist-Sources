import os
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, login_required, logout_user, login_user, current_user
from flask import Flask, render_template, url_for, redirect, flash, request
from oauth import OAuthSignIn
from flask_graphql import GraphQLView


app = Flask(__name__, static_folder='./static/dist', template_folder='./static/src')
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# we can't import User until the db is set up
from models import User, Source, SourceList

# we cant import schema until the models are set up, and they need the db
from schema import schema
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

# manages user authentication and sesions
lm = LoginManager(app)
@lm.user_loader
def load_user(id):
    try:
        return User.query.get(int(id))
    except:
        return None

@app.route('/graphql', methods=['GET', 'POST'])
def graphql():
    return GraphQLView.as_view(
        'graphql',
        schema=schema,
        context={'current_user': current_user},
        graphiql=app.config['DEVELOPMENT'],
    )()



# this route is to handle unauthorized people, just send them to login
@lm.unauthorized_handler
def unauthorized():
    return redirect(url_for('login'))

# this route is for authorizing users
@app.route('/authorize/<provider>')
def authorize(provider):
    # redirect if they are already logged in
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    # get the kind of provider selected
    oauth = OAuthSignIn.get_provider(provider)
    # use their authorize method
    return oauth.authorize()

# this is the callback invoked by the provider after authenticating
@app.route('/oauth_callback/<provider>')
def oauth_callback(provider):
    # check to see if the user is logged in
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, nickname, email = oauth.callback()
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
        user = User(social_id=social_id, nickname=nickname, email=email)
        heap_list = SourceList(name="Heap", user=user, is_heap=True)
        db.session.add(user)
        db.session.add(heap_list)
        db.session.commit()
    # the 'True' tells our login manager to remember the user
    login_user(user, True)
    return redirect(url_for('index'))

# this is the landing page, don't need to be logged in to get here
@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html', title='Login')

# this logs you out and returns you to the landing page
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# this is the index page
@app.route('/', methods=['GET', 'POST'])
@login_required
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
