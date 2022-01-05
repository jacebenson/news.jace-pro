import { routes, useLocation } from '@redwoodjs/router'
import { Fragment, useState } from 'react'
import {
  SimpleGrid,
  Flex,
  Table,
  TableCaption,
  Heading,
} from '@chakra-ui/react'
import TableColumns from 'src/components/TableColumns'
import TableQuery from 'src/components/TableQuery'
import TablePagination from 'src/components/TablePagination'
import TableRows from 'src/components/TableRows/TableRows'
import { initialColumns } from 'src/pages/Article/ArticlesPage'

import { DELETE_ARTICLE_MUTATION } from 'src/components/Article/EditArticleCell'

export const beforeQuery = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { search, pathname } = useLocation()
  let params = new URLSearchParams(search)
  if (pathname !== '/articles') return
  //console.log('beforeQuery', props)
  return {
    variables: {
      q: params.get('q'),
      filter: params.get('filter') || props.fuzzyQuery,
      skip: params.get('skip') || props.skip || 0,
      take: params.get('take') || props.take || 10,
      orderBy: params.get('orderBy') || props.orderBy,
    },

    fetchPolicy: 'no-cache',
  }
}

export const QUERY = gql`
  query FindArticles(
    $filter: String
    $skip: Int
    $take: Int
    $q: String
    $orderBy: OrderByInput
  ) {
    articles(
      filter: $filter
      skip: $skip
      take: $take
      q: $q
      orderBy: $orderBy
    ) {
      count
      take
      skip
      q
      results {
        id
        createdAt
        updatedAt
        title
        link
        sourceId
        source {
          id
          title
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({
  articles,
  fuzzyQuery,
  setFuzzyQuery,
  query,
  setQuery,
  columns,
  setColumns,
  orderBy,
  setOrderBy,
  skip,
  setSkip,
  take,
  setTake,
  roles,
}) => {
  let [data, setData] = useState(articles)
  return (
    <Fragment>
      <Heading>Articles ({data.count})</Heading>
      <TableQuery
        query={query}
        setQuery={setQuery}
        fuzzyQuery={fuzzyQuery}
        setFuzzyQuery={setFuzzyQuery}
        rawQuery={articles.q}
        inputPlaceholder="Search"
        link={(query) => {
          return routes.articles({ q: query })
        }}
        setSkip={setSkip}
      />

      <Table variant="striped" colorScheme={'green'} size="xs">
        <TableCaption>List of Articles</TableCaption>

        <TableColumns
          columns={columns}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          setColumns={setColumns}
          initialColumns={initialColumns}
          setTake={setTake}
        />

        <TableRows
          columns={columns}
          roles={roles}
          setData={setData}
          data={data}
          model="articles"
          deleteMutation={DELETE_ARTICLE_MUTATION}
          displayColumn="id"
        />
      </Table>
      <SimpleGrid columns={2} spacingX="40px" spacingY="20px">
        <Flex padding="10px"></Flex>
        <Flex padding="10px">
          <TablePagination skip={skip} setSkip={setSkip} take={take} />
        </Flex>
      </SimpleGrid>
    </Fragment>
  )
}
