import graphene
from models import User, Source, SourceList


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


class SourceListType(graphene.ObjectType):
    id = graphene.ID(
        description='A source list\'s unique id.',
    )
    name = graphene.String(
        description='The name of a source list.',
    )
    is_heap = graphene.Boolean(
        description='Boolean that indicates whether or not this is a ' \
            'user\'s heap list',
    )
    sources = graphene.List(
        SourceType,
        sourceListId=graphene.ID(),
        description='The sources for a given source list',
    )

    def resolve_sources(self, args, context, info):
        return Source.query.filter_by(source_list_id=self.id)


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
    # all of the sources for a user
    sources = graphene.List(
        SourceType,
        userId=graphene.ID(),
        description='The sources for a given user',
    )
    # all of the source lists for a user
    source_lists = graphene.List(
        SourceListType,
        userId=graphene.ID(),
        description='The source lists for a given user',
    )
    # just the heap list of a user
    heap_list = graphene.Field(
        SourceListType,
        userId=graphene.ID(),
        description='The heap list for a user',
    )

    def resolve_sources(self, args, context, info):
        return Source.query.filter_by(user_id=self.id)

    def resolve_source_lists(self, args, context, info):
        return SourceList.query.filter_by(user_id=self.id)

    def resolve_heap_list(self, args, context, info):
        return SourceList.query.filter_by(user_id=self.id, is_heap=True).first()


class Query(graphene.ObjectType):
    user = graphene.Field(
        UserType,
        # this is an argument to the user root field on Query
        userId=graphene.ID(),
        nickname=graphene.String(),
        description='A user',
    )

    source_lists = graphene.List(
        SourceListType,
        # this is an argument to the source_lists root field on query
        userId=graphene.ID(),
        description='The source lists for a given user',
    )

    sources = graphene.List(
        SourceType,
        # this is an argument to the sources root field on Query
        userId=graphene.ID(),
        description='The sources for a given user',
    )

    def resolve_user(self, args, context, info):
        nickname = args.get('nickname', None)
        if nickname:
            return User.query.filter_by(nickname=nickname).first()
        else:
            user_id = args.get('userId')
            return User.query.get(user_id)

    def resolve_source_lists(self, args, context, info):
        user_id = args.get('userId')
        return SourceList.query.filter_by(user_id=user_id)

    def resolve_sources(self, args, context, info):
        user_id = args.get('userId')
        return Source.query.filter_by(user_id=user_id)


schema = graphene.Schema(query=Query)
