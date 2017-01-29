from app import db
from flask.ext.login import UserMixin


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    # generated not provided (at least at registration time)
    username = db.Column(db.String(64), nullable=False, unique=True)
    name = db.Column(db.String(64), nullable=True)
    email = db.Column(db.String(64), nullable=True)

    def __init__(self, social_id, username, name=None, email=None):
        self.social_id = social_id
        self.username = username
        self.name = name
        self.email = email

    def __repr__(self):
        return '<User: {}>'.format(self.name)

    @classmethod
    def generate_user(cls, social_id, name=None, email=None):
        # need to create a username before making the user
        # if we have a name, use that
        # we ideally should always have a name if we have an email, but
        # lets be safe and check email too just in case
        if name:
            # all lowercase and no spaces
            username = name.lower().replace(' ', '')
        elif email:
            username = email.split('@')[0].lower()
        else:
            username = "USERNAMEERROR"

        # now we have a username and need to make sure it is unique
        # get all the users with that username, tack the count on if need be
        user_count = User.query.filter_by(username=username).count()
        if user_count:
             username = username + str(user_count)

        # our username is now unique so we can save and return the user
        user = cls(social_id=social_id,
                   username=username,
                   name=name,
                   email=email)

        return user


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
