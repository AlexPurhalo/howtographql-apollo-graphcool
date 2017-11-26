import gql from 'graphql-tag'

export const LINKS_SUBSCRIPTION = gql`
subscription {
	Link(filter: {
    mutation_in: [CREATED]
  }) {
    node {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
}
`

export const VOTES_SUBSCRIPTION = gql`
subscription {
  Vote(filter: {
    mutation_in: [CREATED]
  }) {
    node {
      id
      link {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
    user {
        id
      }
    }
  }
}
`