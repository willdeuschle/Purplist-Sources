import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG=False
    TESTING=False
    DEVELOPMENT=False
    CSRF_ENABLED=True
    SECRET_KEY='this-really-needs-to-be-changed'
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    OAUTH_CREDENTIALS = {
        'facebook': {
            'id': '1762608817393911',
            'secret': '8f59c30d0ad693f6a2a3891fabd7ff81'
        },
        'google': {
            'id': '922844835572-s04q0ut5fia5oj3u4nsnfps5obpifdbs.apps.googleusercontent.com',
            'secret': 'SoxNiINy3GPpcO3XKoseINmh'
        }
    }

class ProductionConfig(Config):
    OAUTH_CREDENTIALS = {
        'facebook': {
            'id': '1195308657191327',
            'secret': '3391246fc44e366cc85ff64f160e22e3'
        },
        'google': {
            'id': '922844835572-g2eem8335kkmk2ja89kjlc4p0tpb7hfs.apps.googleusercontent.com',
            'secret': 'QmB0eH3HSx--KkTCG-mJoaqx'
        }
    }

class StagingConfig(Config):
    DEVELOPMENT=True
    DEBUG=True
    OAUTH_CREDENTIALS = {
        'facebook': {
            'id': '157719788054501',
            'secret': '522f75f33205a5ef90dcd1130f6937c7'
        },
        'google': {
            'id': '922844835572-m8f49hovn09bkoqmrhdcb9f6iiqistm2.apps.googleusercontent.com',
            'secret': 'hcKCbZyrF4cII-PVOqelRK9H'
        }
    }

class DevelopmentConfig(Config):
    DEVELOPMENT=True
    DEBUG=True

class TestingConfig(Config):
    TESTING=True
