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

// grab data necessary for the HeapList component
export const heapListQuery = gql`
  query heapListQuery($cu_id: ID!) {
    user(userId: $cu_id) {
      name,
      heapList {
        id,
        name,
        sources {
          ...SourceInfoFragment,
        },
      },
    },
  }
  ${SourceInfoFragment.source_info},
`

export const sourceListQuery = gql`
  query sourceListQuery($cu_id: ID!) {
    sourceLists(userId: $cu_id) {
      id,
      name,
      isHeap,
    },
  }
`

export const userQuery = gql`
  query userQuery($cu_id: ID!) {
    user(userId: $cu_id) {
      name,
    },
  }
`

export const queryTypes = {
  heapListQuery: 'heapListQuery',
  sourceListQuery: 'sourceListQuery',
}
