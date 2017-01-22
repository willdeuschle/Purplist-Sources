import os
from flask.ext.sqlalchemy import SQLAlchemy
from flask import Flask, render_template


app = Flask(__name__, static_folder='./static/dist', template_folder='./static/src')
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


from models import Source


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
