import os
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, login_required, logout_user, login_user, current_user
from flask import Flask, render_template, url_for, redirect, flash
from oauth import OAuthSignIn


app = Flask(__name__, static_folder='./static/dist', template_folder='./static/src')
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import User

# manages user authentication and sesions
lm = LoginManager(app)
@lm.user_loader
def load_user(id):
    return User.query.get(int(id))


# this is only for development right now, but it logs the user in
@app.route('/unsafe_login', methods=['GET', 'POST'])
def unsafe_login():
    w = User.query.first()
    login_user(w)
    return redirect(url_for('index'))

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
    if not user:
        user = User(social_id=social_id, nickname=nickname, email=email)
        db.session.add(user)
        db.session.commit()
    login_user(user, True)
    return redirect(url_for('index'))

# this is the landing page, don't need to be logged in to get here
@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')

# this logs you out and returns you to the landing page
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# this is the index page
@app.route('/home', methods=['GET', 'POST'])
@login_required
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
