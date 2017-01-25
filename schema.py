import graphene
from models import User, Source


class SourceType(graphene.ObjectType):
    id = graphene.ID(
        description='A source\'s unique id.',
    )
    title = graphene.String(
        description='The title of a source.',
    )
    source_url = graphene.String(
        description='The url for a source.',
    )
    favicon_url = graphene.String(
        description='The icon for a source.',
    )


class UserType(graphene.ObjectType):
    id = graphene.ID(
        description='A user\'s unique id.',
    )
    nickname = graphene.String(
        description='A user\'s nickname',
    )
    email = graphene.String(
        description='A user\'s email, can be null.',
    )
    sources = graphene.List(
        SourceType,
        userId=graphene.ID(),
        description='The sources for a given user',
    )

    def resolve_sources(self, args, context, info):
        return Source.query.filter_by(user_id=self.id)


class Query(graphene.ObjectType):
    user = graphene.Field(
        UserType,
        # this is an argument to the user root field on Query
        userId=graphene.ID(),
        nickname=graphene.String(),
        description='A user',
    )

    sources = graphene.List(
        SourceType,
        # this is an argument to the sources root field on Query
        userId = graphene.ID(),
        description='The sources for a given user',
    )

    def resolve_user(self, args, context, info):
        nickname = args.get('nickname', None)
        if nickname:
            return User.query.filter_by(nickname=nickname).first()
        else:
            user_id = args.get('userId')
            return User.query.get(user_id)

    def resolve_sources(self, args, context, info):
        user_id = args.get('userId')
        return Source.query.filter_by(user_id=user_id)


schema = graphene.Schema(query=Query)
