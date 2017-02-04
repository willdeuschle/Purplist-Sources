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
  mutation updateSource($sourceData: SourceInput!) {
    updateSource(sourceData: $sourceData) {
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
  mutation deleteSource($id: ID!) {
    deleteSource(id: $id) {
      id,
      title,
      faviconUrl,
      userId,
      sourceUrl,
      sourceListId,
    }
  }
`


export const mutationTypes = {
  APOLLO_MUTATION_RESULT: 'APOLLO_MUTATION_RESULT',
  createSource: 'createSource',
  createSourceList: 'createSourceList',
  updateSource: 'updateSource',
  deleteSource: 'deleteSource',
}
