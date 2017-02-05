import gql from 'graphql-tag'

// fragment for the sources
export const SourceInfoFragment = {
  source_info: gql`
    fragment SourceInfoFragment on SourceType {
      id,
      title,
      sourceUrl,
      faviconUrl,
  },
`}


// grab the user we are currently viewing
export const userQuery = gql`
  query userQuery($username: String!) {
    user(username: $username) {
      username,
      id,
    },
  }
`

// grab info related to the user and the current source list
export const currentUserDataQuery = gql`
  query currentUserDataQuery($userId: ID!, $sourceListId: ID) {
    user(userId: $userId) {
      name,
      numSources,
      numSourceLists,
    },
    sourceList(userId: $userId, sourceListId: $sourceListId) {
      name,
      isHeap,
    },
  }
`

// grab info for a given source list
export const sourceListQuery = gql`
  query sourceListQuery($userId: ID!, $sourceListId: ID) {
    sourceList(userId: $userId, sourceListId: $sourceListId) {
      id,
      sources {
        ...SourceInfoFragment,
      },
    },
  }
  ${SourceInfoFragment.source_info},
`

// grab all of a users source lists
export const sourceListsQuery = gql`
  query sourceListsQuery($userId: ID!) {
    sourceLists(userId: $userId) {
      id,
      name,
      isHeap,
    },
  }
`

export const queryTypes = {
  userQuery: 'userQuery',
  sourceListQuery: 'sourceListQuery',
  sourceListsQuery: 'sourceListsQuery',
}
