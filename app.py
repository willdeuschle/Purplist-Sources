import os
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask import Flask, render_template


app = Flask(__name__, static_folder='./static/dist', template_folder='./static/src')
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import User

# manages user authentication
lm = LoginManager(app)
@lm.user_loader
def load_user(id):
    return User.query.get(int(id))



@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('login.html')

@app.route('/home', methods=['GET', 'POST'])
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
