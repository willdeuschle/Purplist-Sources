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

class SourceListFields(graphene.AbstractType):
    id = graphene.ID(
        description='A source list\'s unique id.',
    )
    user_id = graphene.ID(
        description='The id of the associated user.',
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

class SourceListType(graphene.ObjectType, SourceListFields):
    def resolve_sources(self, args, context, info):
        return Source.query.filter_by(source_list_id=self.id)

class DeleteSourceList(graphene.Mutation, SourceListFields):
    class Input:
        user_id = graphene.ID()
        id = graphene.ID()

    user_username = graphene.String(
        description='The username of the user that owns this source list',
    )

    def resolve_user_username(self, args, context, info):
        user = User.query.get(self.user_id)
        return user.username

    def mutate(self, args, context, info):
        id = args.get('id')
        source_list = SourceList.query.get(id)
        if source_list.is_heap:
            raise ValueError('Cannot delete your heap')
        db.session.delete(source_list)
        db.session.commit()

        return source_list

class CreateSourceList(graphene.Mutation, SourceListFields):
    class Input:
        user_id = graphene.ID()
        name = graphene.String()

    def mutate(self, args, context, info):
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
        source_list_id = graphene.ID()
        # eventually we will want to support adding to different lists
        # source_list_id = graphene.Int()

    def mutate(self, args, context, info):
        # first get the SourceInput as source_data
        # source_data = args.get('source_data')
        # must be given a user_id, and source_url
        user_id = args.get('user_id')
        source_url = args.get('source_url')
        # we won't necessarily get the source_list_id, in which case we
        # add it to the heap list
        source_list_id = args.get('source_list_id', None)

        # get the user object
        user = User.query.get(user_id)

        # if we have the source_list_id, get the source_list, otherwise
        # get the users heap list
        if source_list_id:
            source_list = SourceList.query.get(source_list_id)
        else:
            source_list = SourceList.query.filter_by(user_id=user_id, is_heap=True).first()

        # query for the title or use the source url
        try:
            req = Request(source_url, headers={'User-Agent': 'Magic-Browser'})
            fake_it = urlopen(req)
            soup = BeautifulSoup(fake_it.read(), "html.parser")
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

        # create the new source
        new_source = Source(
            title=title,
            source_url=source_url,
            favicon_url=favicon_url,
            user=user,
            source_list=source_list,
        )

        db.session.add(new_source)
        db.session.commit()

        return CreateSource(
            user_id=new_source.user.id,
            source_list_id=new_source.source_list.id,
            title=new_source.title,
            source_url=new_source.source_url,
            favicon_url=new_source.favicon_url,
            id=new_source.id,
        )


# eventually it might be a good idea to change this to archiving
# instead of deleting
class DeleteSource(graphene.Mutation, SourceFields):
    class Input:
        # we only need the user_id and source's id to delete something
        id = graphene.ID()
        user_id = graphene.ID()

    def mutate(self, args, context, info):
        id = args.get('id')
        source = Source.query.get(id)
        db.session.delete(source)
        db.session.commit()

        return source



class UpdateSource(graphene.Mutation, SourceFields):
    class Input:
        source_data = SourceInput()
        user_id = graphene.ID()
        # source_id = graphene.ID()
        # title = graphene.String()
        # source_list_id = graphene.ID()
        # source_url = graphene.String()
        # favicon_url = graphene.String()


    def mutate(self, args, context, info):
        # first get the SourceInput as source_data
        source_data = args.get('source_data')
        id = source_data.pop('id')
        source = Source.query.get(id)

        for key, value in source_data.items():
            setattr(source, key, value)

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
    username = graphene.String(
        description='A user\'s username',
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
    # number of sources for a user
    num_sources = graphene.Int(
        description='Total number of sources a user has',
    )
    # number of source lists for a user
    num_source_lists = graphene.Int(
        description='Total number of source lists a user has',
    )

    def resolve_sources(self, args, context, info):
        return Source.query.filter_by(user_id=self.id)

    def resolve_source_lists(self, args, context, info):
        return SourceList.query.filter_by(user_id=self.id)

    def resolve_heap_list(self, args, context, info):
        return SourceList.query.filter_by(user_id=self.id, is_heap=True).first()

    def resolve_num_sources(self, args, context, info):
        return Source.query.filter_by(user_id=self.id).count()

    def resolve_num_source_lists(self, args, context, info):
        return SourceList.query.filter_by(user_id=self.id).count()


class Query(graphene.ObjectType):
    user = graphene.Field(
        UserType,
        # this is an argument to the user root field on Query
        user_id=graphene.ID(),
        username=graphene.String(),
        description='A user',
    )

    search_users = graphene.List(
        UserType,
        # argument to filter the users on
        name=graphene.String(),
        description='Users',
    )

    source_list = graphene.Field(
        SourceListType,
        user_id=graphene.ID(),
        source_list_id=graphene.ID(),
        description='An individual source list',
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
        username = args.get('username', None)
        if username:
            user = User.query.filter_by(username=username).first()
            return user
        # going to maintain this for a little while but hopefully get
        # rid of it eventually
        user_id = args.get('user_id', None)
        if user_id:
            return User.query.get(user_id)
        # name = args.get('name', None)
        # if name:
            # return User.query.filter_by(name=name).first()
        # else:
            # user_id = args.get('user_id')
            # return User.query.get(user_id)

    def resolve_search_users(self, args, context, info):
        name = args.get('name')
        name_filter = '%{0}%'.format(name)
        # need to filter based on the name provided
        return User.query.filter(User.name.ilike(name_filter))

    # this is meant to resolve only a single source list at a time
    def resolve_source_list(self, args, context, info):
        user_id = args.get('user_id')
        source_list_id = args.get('source_list_id', None)
        # dont need to pass the user id here but might as well be safe
        if source_list_id:
            return SourceList.query.filter_by(user_id=user_id, id=source_list_id).first()
        # if we don't pass a specific list id just return the heap
        return SourceList.query.filter_by(user_id=user_id, is_heap=True).first()

    # this is meant to resolve all of the source lists of a user
    def resolve_source_lists(self, args, context, info):
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
    delete_source_list = DeleteSourceList.Field()


class GraphqlAuthorizationMiddleware(object):
    '''
    The purpose of this class is to authorize incoming mutations. Basically,
    it checks to make sure the current user is the same as that of the user's
    information we are trying to mutate. Since this middleware will be run
    several times over the course of a single mutation, we add an 'authorized'
    field to the context after we are confident that we can authorize the
    execution
    '''
    def resolve(self, next, root, args, context, info):
        # if this is a mutation
        if info.operation.operation == 'mutation':
            # can skip this if they are already authorized
            if not context.get('authorized', False):
                # make sure they are passing a user id
                if not args.get('user_id', None):
                    raise ValueError('Mutating without a userId')
                # make sure they are only mutating the current user
                if context.get('current_user').id != int(args.get('user_id')):
                    raise ValueError('Mutating as someone other than the current user')
                # validate for the remainder of this query
                context['authorized'] = True
        return next(root, args, context, info)


schema = graphene.Schema(query=Query, mutation=Mutation)
