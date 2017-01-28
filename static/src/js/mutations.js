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

export const mutationTypes = {
  APOLLO_MUTATION_RESULT: 'APOLLO_MUTATION_RESULT',
  createSource: 'createSource',
}
