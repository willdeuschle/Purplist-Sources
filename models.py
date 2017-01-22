from app import db
from flask.ext.login import UserMixin


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    nickname = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=True)

    def __init__(self, social_id, nickname, email):
        self.social_id = social_id
        self.nickname = nickname
        self.email = email

    def __repr__(self):
        return '<User: {}>'.format(self.nickname)


class Source(db.Model):
    __tablename__ = 'sources'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String())
    source_url = db.Column(db.String())
    favicon_url = db.Column(db.String())

    def __init__(self, title, source_url, favicon_url):
        self.title = title
        self.source_url = source_url
        self.favicon_url = favicon_url

    def __repr__(self):
        return '<Source: {}>'.format(self.title)
