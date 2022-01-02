export const schema = gql`
  type Article {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    link: String!
    sourceId: Int!
    source: Source!
  }

  type Articles {
    results: [Article!]!
    count: Int!
    take: Int!
    skip: Int!
    q: String
  }

  type Query {
    articles(
      filter: String
      skip: Int
      take: Int
      orderBy: OrderByInput
      q: String
    ): Articles! @requireAuth(roles: ["articleRead", "admin"])

    article(id: Int!): Article @requireAuth(roles: ["articleRead", "admin"])
  }

  input CreateArticleInput {
    title: String!
    link: String!
    sourceId: Int!
  }

  input UpdateArticleInput {
    title: String
    link: String
    sourceId: Int
  }

  type Mutation {
    createArticle(input: CreateArticleInput!): Article!
      @requireAuth(roles: ["articleCreate", "admin"])
    updateArticle(id: Int!, input: UpdateArticleInput!): Article!
      @requireAuth(roles: ["articleUpdate", "admin"])
    deleteArticle(id: Int!): Article!
      @requireAuth(roles: ["articleDelete", "admin"])
  }
`
