import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG=False
    TESTING=False
    CSRF_ENABLED=True
    SECRET_KEY='this-really-needs-to-be-changed'
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    OAUTH_CREDENTIALS = {
        'facebook': {
            'id': '1762608817393911',
            'secret': '8f59c30d0ad693f6a2a3891fabd7ff81'
        }
    }

class ProductionConfig(Config):
    DEBUG=False

class StagingConfig(Config):
    DEVELOPMENT=True
    DEBUG=True

class DevelopmentConfig(Config):
    DEVELOPMENT=True
    DEBUG=True

class TestingConfig(Config):
    TESTING=True
