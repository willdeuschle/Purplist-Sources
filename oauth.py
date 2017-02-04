from flask import redirect, current_app, url_for, request
from rauth import OAuth2Service
import json

class OAuthSignIn(object):
    providers = None

    def __init__(self, provider_name):
        self.provider_name = provider_name
        credentials = current_app.config['OAUTH_CREDENTIALS'][provider_name]
        self.consumer_id = credentials['id']
        self.consumer_secret = credentials['secret']

    def authorize(self):
        pass

    def callback(self):
        pass

    def get_callback_url(self):
        return url_for('oauth_callback',
                       provider=self.provider_name,
                       _external=True)

    @classmethod
    def get_provider(cls, provider_name):
        if cls.providers is None:
            cls.providers = {}
            for provider_class in cls.__subclasses__():
                provider = provider_class()
                cls.providers[provider.provider_name] = provider
        return cls.providers[provider_name]


class FacebookSignin(OAuthSignIn):
    def __init__(self):
        super(FacebookSignin, self).__init__('facebook')
        self.service = OAuth2Service(
            name='facebook',
            client_id=self.consumer_id,
            client_secret=self.consumer_secret,
            # authorize_url='https://www.facebook.com/v2.8/dialog/oauth',
            # access_token_url='https://graph.facebook.com/v2.8/oauth/access_token',
            authorize_url='https://graph.facebook.com/oauth/authorize',
            access_token_url='https://graph.facebook.com/oauth/access_token',
            base_url='https://graph.facebook.com/'
        )

    def authorize(self):
        params = {'scope': 'email',
                  'response_type': 'code',
                  'redirect_uri': self.get_callback_url()}
        return redirect(self.service.get_authorize_url(**params))

    def callback(self):
        # need the code from facebook to do anything further
        if 'code' not in request.args:
            return None, None, None
        oauth_session = self.service.get_auth_session(
            data={'code': request.args['code'],
                'grant_type': 'authorization_code',
                'redirect_uri': self.get_callback_url()}
        )

        me = oauth_session.get('me', params={'fields':'name,email'}).json()

        name = me.get('name', None)
        email = me.get('email', None)

        # if we don't have a name but do have an email, use the
        # first half of the email
        if not name and email:
            name = email.split('@')[0]

        return (
            'facebook$:' + me['id'],
            name,
            email
        )

class GoogleSignIn(OAuthSignIn):
    def __init__(self):
        super(GoogleSignIn, self).__init__('google')
        self.service = OAuth2Service(
            name='google',
            client_id=self.consumer_id,
            client_secret=self.consumer_secret,
            authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
            access_token_url='https://www.googleapis.com/oauth2/v3/token',
            base_url='https://www.googleapis.com/oauth2/v3/'
        )

    def authorize(self):
        params = {'scope': 'email',
                  'response_type': 'code',
                  'redirect_uri': self.get_callback_url()}
        return redirect(self.service.get_authorize_url(**params))

    def callback(self):
        # need the code from facebook to do anything further
        if 'code' not in request.args:
            return None, None, None
        oauth_session = self.service.get_auth_session(
            data={'code': request.args['code'],
                'grant_type': 'authorization_code',
                'redirect_uri': self.get_callback_url()},
            decoder=lambda b: json.loads(b.decode('utf-8'))
        )

        me = oauth_session.get('userinfo')

        # google is sending back this information as bytes
        me_info = json.loads(getattr(me, '_content').decode('utf-8'))

        name = me_info.get('name', None)
        email = me_info.get('email', None)

        # if we don't have a name but do have an email, use the
        # first half of the email
        if not name and email:
            name = email.split('@')[0]

        return (
            'google$:' + me_info.get('sub'),
            name,
            email
        )
