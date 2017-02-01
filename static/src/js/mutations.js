import gql from 'graphql-tag'

// mutation to execute to add a source by its url
export const createSource = gql`
  mutation createSource($cu_id: ID!, $sourceUrl: String!) {
    createSource(userId: $cu_id, sourceUrl: $sourceUrl) {
      id,
      title,
      faviconUrl,
      userId,
      sourceUrl,
    }
  }
`

export const createSourceList = gql`
  mutation createSourceList($cu_id: ID!, $sourceListName: String!) {
    createSourceList(userId: $cu_id, name: $sourceListName) {
      name,
      id,
      isHeap,
    }
  }
`

export const updateSourceList = gql`
  mutation updateSourceList($sourceId: ID!, sourceListId: ID!) {
    id,
    sourceListId,
  }
`

export const mutationTypes = {
  APOLLO_MUTATION_RESULT: 'APOLLO_MUTATION_RESULT',
  createSource: 'createSource',
  createSourceList: 'createSourceList',
  updateSourceList: 'updateSourceList',
}
