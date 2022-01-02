import Source from 'src/components/Source/Source'

export const QUERY = gql`
  query FindSourceById($id: Int!) {
    source: source(id: $id) {
      id
      createdAt
      updatedAt
      title
      feedLink
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Source not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ source }) => {
  return <Source source={source} />
}
