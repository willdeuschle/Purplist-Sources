import graphene
# for getting the favicon
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
from requests import get
from models import User, Source, SourceList
from app import db


class SourceFields(graphene.AbstractType):
    id = graphene.ID(
        description='A source\'s unique id.',
    )
    user_id = graphene.ID(
        description='The id of the associated user.',
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
    source_list_id = graphene.ID(
        description='The id of the associated source list',
    )

class SourceType(graphene.ObjectType, SourceFields):
    pass

class SourceInput(graphene.InputObjectType, SourceFields):
    pass

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
        source_list_id=graphene.ID(),
        description='The sources for a given source list',
    )

    def resolve_sources(self, args, context, info):
        return Source.query.filter_by(source_list_id=self.id)


class CreateSourceList(graphene.Mutation):
    class Input:
        user_id = graphene.ID()
        name = graphene.String()

    id = graphene.ID()
    user_id = graphene.ID()
    name = graphene.String()
    is_heap = graphene.Boolean()

    def mutate(self, args, context, info):
        print("We are mutation sorucelist")
       # parameters we need
        user_id = args.get('user_id')
        name = args.get('name')

        user = User.query.get(user_id)

        new_source_list = SourceList(
            user=user,
            name=name,
            is_heap=False,
        )

        db.session.add(new_source_list)
        db.session.commit()

        return CreateSourceList(
            user_id=new_source_list.user.id,
            name=new_source_list.name,
            id=new_source_list.id,
            is_heap=new_source_list.is_heap,
        )


class CreateSource(graphene.Mutation, SourceFields):
    class Input:
        # source_data = SourceInput()
        user_id = graphene.ID()
        source_url = graphene.String()
        # eventually we will want to support adding to different lists
        # source_list_id = graphene.Int()

    def mutate(self, args, context, info):
        # first get the SourceInput as source_data
        # source_data = args.get('source_data')
        print("WE ARE HERE")
        # must be given a user_id, and source_url
        user_id = args.get('user_id')
        source_url = args.get('source_url')

        # query for the title or use the source url
        try:
            req = Request(source_url, headers={'User-Agent': 'Magic-Browser'})
            fake_it = urlopen(req)
            soup = BeautifulSoup(fake_it.read())
            title = soup.title.string
        except:
            title = source_url

        # query for the favicon url based on the source_url
        try:
            url_info = urlparse(source_url)
            favicon_attempt = url_info.scheme + '://' + url_info.netloc + '/favicon.ico'
            get(favicon_attempt)
            favicon_url = favicon_attempt
        except:
            favicon_url = ''

        # get the user and their heap list from the db
        user = User.query.get(user_id)
        # for the moment we are only allowing additions to the heap
        heap_list = SourceList.query.filter_by(user_id=user_id, is_heap=True).first()

        # create the new source
        new_source = Source(
            title=title,
            source_url=source_url,
            favicon_url=favicon_url,
            user=user,
            source_list=heap_list
        )

        db.session.add(new_source)
        db.session.commit()

        print("WHAT IS NS", new_source.__dict__, new_source.user.id)

        return CreateSource(
            user_id=new_source.user_id,
            source_list_id=new_source.source_list_id,
            title=new_source.title,
            source_url=new_source.source_url,
            favicon_url=new_source.favicon_url,
            id=new_source.id,
        )


# eventually it might be a good idea to change this to archiving
# instead of deleting
class DeleteSource(graphene.Mutation, SourceFields):
    class Input:
        # we only need the id to delete something
        id = graphene.ID()

    def mutate(self, args, context, info):
        id = args.get('id')
        source = Source.query.get(id)
        db.session.delete(source)
        db.session.commit()

        return source



class UpdateSource(graphene.Mutation, SourceFields):
    class Input:
        source_data = SourceInput()
        # source_id = graphene.ID()
        # title = graphene.String()
        # source_list_id = graphene.ID()
        # source_url = graphene.String()
        # favicon_url = graphene.String()


    def mutate(self, args, context, info):
        # first get the SourceInput as source_data
        source_data = args.get('source_data')
        print("what are args", args)
        id = source_data.pop('id')
        source = Source.query.get(id)

        for key, value in source_data.items():
            setattr(source, key, value)

        print("what is source now", source)
        db.session.add(source)
        db.session.commit()

        return UpdateSource(
            id = source.id,
            user_id = source.user_id,
            source_list_id = source.source_list_id,
            title = source.title,
            source_url = source.source_url,
            favicon_url = source.favicon_url,
        )


class UserType(graphene.ObjectType):
    id = graphene.ID(
        description='A user\'s unique id.',
    )
    name = graphene.String(
        description='A user\'s name',
    )
    email = graphene.String(
        description='A user\'s email, can be null.',
    )
    # all of the sources for a user
    sources = graphene.List(
        SourceType,
        user_id=graphene.ID(),
        description='The sources for a given user',
    )
    # all of the source lists for a user
    source_lists = graphene.List(
        SourceListType,
        user_id=graphene.ID(),
        description='The source lists for a given user',
    )
    # just the heap list of a user
    heap_list = graphene.Field(
        SourceListType,
        user_id=graphene.ID(),
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
        user_id=graphene.ID(),
        name=graphene.String(),
        description='A user',
    )

    source_lists = graphene.List(
        SourceListType,
        # this is an argument to the source_lists root field on query
        user_id=graphene.ID(),
        description='The source lists for a given user',
    )

    sources = graphene.List(
        SourceType,
        # this is an argument to the sources root field on Query
        user_id=graphene.ID(),
        description='The sources for a given user',
    )

    def resolve_user(self, args, context, info):
        name = args.get('name', None)
        if name:
            return User.query.filter_by(name=name).first()
        else:
            user_id = args.get('user_id')
            return User.query.get(user_id)

    def resolve_source_lists(self, args, context, info):
        print("we are here", args, SourceList.query.filter_by(user_id=args['user_id']))
        user_id = args.get('user_id')
        return SourceList.query.filter_by(user_id=user_id)

    def resolve_sources(self, args, context, info):
        user_id = args.get('user_id')
        return Source.query.filter_by(user_id=user_id)


class Mutation(graphene.ObjectType):
    create_source = CreateSource.Field()
    delete_source = DeleteSource.Field()
    update_source = UpdateSource.Field()
    create_source_list = CreateSourceList.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
