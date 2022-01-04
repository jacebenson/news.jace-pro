export const schema = gql`
  type Source {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    feedLink: String!
    contentType: String!
    groupId: Int!
    group: Group!
    Article: [Article]!
  }

  type Sources {
    results: [Source!]!
    count: Int!
    take: Int!
    skip: Int!
    q: String
  }

  type Query {
    sources(
      filter: String
      skip: Int
      take: Int
      orderBy: OrderByInput
      q: String
    ): Sources! @requireAuth(roles: ["sourceRead", "admin"])

    source(id: Int!): Source @requireAuth(roles: ["sourceRead", "admin"])
  }

  input CreateSourceInput {
    title: String!
    feedLink: String!
  }

  input UpdateSourceInput {
    title: String
    feedLink: String
    contentType: String
    groupId: Int
  }

  type Mutation {
    createSource(input: CreateSourceInput!): Source!
      @requireAuth(roles: ["sourceCreate", "admin"])
    updateSource(id: Int!, input: UpdateSourceInput!): Source!
      @requireAuth(roles: ["sourceUpdate", "admin"])
    deleteSource(id: Int!): Source!
      @requireAuth(roles: ["sourceDelete", "admin"])
  }
`
