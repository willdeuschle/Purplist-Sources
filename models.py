from app import db
# from sqlalchemy.dialects.postgresql import JSON


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
        return '<id {}>'.format(self.id)
