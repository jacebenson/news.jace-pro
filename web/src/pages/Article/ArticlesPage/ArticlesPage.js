import ArticlesCell from 'src/components/Article/ArticlesCell'
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
  //     return routes.article({ id: givenId })
  //   },
  //   dataType: 'integer',
  //   showMatching,
  //   filterOut,
  // },

  {
    Header: 'Date',
    accessor: 'createdAt',
    dateFormat: 'sv-SE',
    showMatching,
    filterOut,
  },
  {
    Header: 'Title',
    accessor: 'title',
    linkField: 'link',
    showMatching,
    filterOut,
  },
  {
    Header: 'Source',
    accessor: 'source',
    field: 'title',
    reference: true,
    link: (givenId) => {
      return routes.source({ id: givenId })
    },
    showMatching,
    filterOut,
    canSort: false,
  },

  /** Insert your columns here **/
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

const ArticlesPage = () => {
  let [fuzzyQuery, setFuzzyQuery] = useState('')
  let [query, setQuery] = useState('')
  let [orderBy, setOrderBy] = useState({ createdAt: 'desc' })
  let [skip, setSkip] = useState(0)
  let [take, setTake] = useState(1000)
  let [columns, setColumns] = useState(initialColumns)
  let roles = {
    createRecord: 'articleCreate',
    updateRecord: 'articleUpdate',
    deleteRecord: 'articleDelete',
  }

  return (
    <Fragment>
      <MetaTags
        title={'Article'}
        description={'Article'}
        /* you should un-comment description and add a unique description, 155 characters or less
      You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
      />

      <ArticlesCell
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

export default ArticlesPage
