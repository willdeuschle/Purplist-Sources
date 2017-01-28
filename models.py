from app import db
from flask.ext.login import UserMixin


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    nickname = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(64), nullable=True)

    def __init__(self, social_id, nickname, email=None):
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
    # foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='sources')
    # another foreign key for lists
    source_list_id = db.Column(db.Integer, db.ForeignKey('source_lists.id'))
    source_list = db.relationship('SourceList', backref='sources')

    def __init__(self, title, source_url, favicon_url, user, source_list):
        self.title = title
        self.source_url = source_url
        self.favicon_url = favicon_url
        self.user = user
        self.source_list = source_list

    def __repr__(self):
        return '<Source: {}>'.format(self.title)

class SourceList(db.Model):
    __tablename__ = 'source_lists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    is_heap = db.Column(db.Boolean())
    # foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', backref='source_lists')

    def __init__(self, name, user, is_heap=False):
        self.name = name
        self.user = user
        self.is_heap = is_heap

    def __repr__(self):
        return '<SourceList: {}>'.format(self.name)
