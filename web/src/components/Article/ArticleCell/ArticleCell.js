import Article from 'src/components/Article/Article'

export const QUERY = gql`
  query FindArticleById($id: Int!) {
    article: article(id: $id) {
      id
      createdAt
      updatedAt
      title
      link
      sourceId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Article not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ article }) => {
  return <Article article={article} />
}
