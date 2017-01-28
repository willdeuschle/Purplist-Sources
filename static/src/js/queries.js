import gql from 'graphql-tag'

// grab data necessary for the HeapList component
export const heapListQuery = gql`
  query heapListQuery($cu_id: ID!) {
    user(userId: $cu_id) {
      nickname,
      heapList {
        name,
        sources {
          id,
          title,
          sourceUrl,
          faviconUrl,
        },
      },
    },
  }
`
export const queryTypes = {
  heapListQuery: 'heapListQuery',
}
