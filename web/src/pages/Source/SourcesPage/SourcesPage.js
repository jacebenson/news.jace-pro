import SourcesCell from 'src/components/Source/SourcesCell'
import { useState } from 'react'
import { routes } from '@redwoodjs/router'
import { Fragment } from 'react'
import { MetaTags } from '@redwoodjs/web'
import { showMatching, filterOut } from '/src/lib/atomicFunctions'

export const initialColumns = [
  // {
  //   Header: 'Id',
  //   accessor: 'id',
  //   link: (givenId) => {
  //     return routes.source({ id: givenId })
  //   },
  //   dataType: 'integer',
  //   showMatching,
  //   filterOut,
  // },

  {
    Header: 'Title',
    accessor: 'title',
    link: (givenId) => {
      return routes.source({ id: givenId })
    },
    showMatching,
    filterOut,
  },

  {
    Header: 'Group',
    accessor: 'group',
    field: 'name',
    reference: true,
    link: (givenId) => {
      return routes.group({ id: givenId })
    },
    showMatching,
    filterOut,
    canSort: false,
  },
  {
    Header: 'Feed',
    accessor: 'feedLink',
    showMatching,
    filterOut,
  },
  {
    Header: 'Articles',
    accessor: 'Article',
    aggregate: true,
    canSort: false,
    model: 'content',
    link: (givenId) => {
      return routes.articles({ q: `{"sourceId": ${givenId}}` })
    },
  },
  //  {
  //    Header: 'Articles',
  //    accessor: 'Article',
  //    aggregate: true,
  //    model: 'article',
  //  },
  {
    Header: 'Actions',
    accessor: 'actions',
    canSort: false,
    canRemove: false,
    canReset: true,
    canExport: true,
    canSetTake: true,
  },
]

const SourcesPage = () => {
  let [fuzzyQuery, setFuzzyQuery] = useState('')
  let [query, setQuery] = useState('')
  let [orderBy, setOrderBy] = useState({ id: 'asc' })
  let [skip, setSkip] = useState(0)
  let [take, setTake] = useState(10)
  let [columns, setColumns] = useState(initialColumns)
  let roles = {
    createRecord: 'sourceCreate',
    updateRecord: 'sourceUpdate',
    deleteRecord: 'sourceDelete',
  }

  return (
    <Fragment>
      <MetaTags
        title={'Source'}
        description={'Source'}
        /* you should un-comment description and add a unique description, 155 characters or less
      You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
      />

      <SourcesCell
        fuzzyQuery={fuzzyQuery}
        setFuzzyQuery={setFuzzyQuery}
        query={query}
        setQuery={setQuery}
        columns={columns}
        setColumns={setColumns}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        skip={skip}
        setSkip={setSkip}
        take={take}
        setTake={setTake}
        roles={roles}
      />
    </Fragment>
  )
}

export default SourcesPage
