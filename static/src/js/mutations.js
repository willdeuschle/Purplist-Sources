import gql from 'graphql-tag'

// mutation to execute to add a source by its url
export const createSource = gql`
  mutation createSource($userId: ID!, $sourceUrl: String!) {
    createSource(userId: $userId, sourceUrl: $sourceUrl) {
      id,
      title,
      faviconUrl,
      userId,
      sourceUrl,
      sourceListId,
    }
  }
`

export const createSourceList = gql`
  mutation createSourceList($userId: ID!, $sourceListName: String!) {
    createSourceList(userId: $userId, name: $sourceListName) {
      name,
      id,
      isHeap,
    }
  }
`

export const updateSource = gql`
  mutation updateSource($userId: ID!, $sourceData: SourceInput!) {
    updateSource(userId: $userId, sourceData: $sourceData) {
      id,
      title,
      faviconUrl,
      userId,
      sourceUrl,
      sourceListId,
    }
  }
`


export const deleteSource = gql`
  mutation deleteSource($userId: ID!, $id: ID!) {
    deleteSource(userId: $userId, id: $id) {
      id,
      title,
      faviconUrl,
      userId,
      sourceUrl,
      sourceListId,
    }
  }
`

export const deleteSourceList = gql`
  mutation deleteSourceList($userId: ID!, $id: ID!) {
    deleteSourceList(userId: $userId, id: $id) {
      id,
      userId,
      name,
      userUsername,
    }
  }
`


export const mutationTypes = {
  APOLLO_MUTATION_RESULT: 'APOLLO_MUTATION_RESULT',
  createSource: 'createSource',
  createSourceList: 'createSourceList',
  updateSource: 'updateSource',
  deleteSource: 'deleteSource',
  deleteSourceList: 'deleteSourceList',
}
