import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import FormComponent from 'src/components/FormComponent'

import { Fragment } from 'react'

export const QUERY = gql`
  query EditSourceById($id: Int!) {
    source: source(id: $id) {
      id
      createdAt
      updatedAt
      title
      feedLink
      contentType
      groupId
      group {
        name
        id
      }
    }
  }
`
const UPDATE_SOURCE_MUTATION = gql`
  mutation UpdateSourceMutation($id: Int!, $input: UpdateSourceInput!) {
    updateSource(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      title
      feedLink
      contentType
      groupId
    }
  }
`
export const DELETE_SOURCE_MUTATION = gql`
  mutation DeleteSourceMutation($id: Int!) {
    deleteSource(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ source }) => {
  console.log('source', source)
  const [updateSource, { loading, error }] = useMutation(
    UPDATE_SOURCE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Source updated')
        navigate(routes.sources())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSubmit = (data) => {
    console.log('saving', data)
    /**TODO: FEAT Client Rules go here */
    onSave(data, source.id)
  }
  const onSave = (input, id) => {
    const castInput = Object.assign(input, {
      groupId: parseInt(input.groupId),
    })

    updateSource({ variables: { id, input: castInput } })
  }

  const [deleteSource] = useMutation(DELETE_SOURCE_MUTATION, {
    onCompleted: () => {
      toast.success('Source deleted')
      navigate(routes.sources())
    },
  })

  const onDelete = (id) => {
    if (confirm('Are you sure you want to delete Source ' + id + '?')) {
      deleteSource({ variables: { id } })
    }
  }
  const fields = [
    {
      name: 'title',
      prettyName: 'Title',
    },
    {
      name: 'feedLink',
      prettyName: 'feedLink',
    },
    {
      name: 'contentType',
      prettyName: 'contentType',
    },
    // {
    //   name: 'groupId',
    //   prettyName: 'groupId',
    // },
    {
      name: 'groupId',
      prettyName: 'Group',
      type: 'reference',
      display: 'name',
      defaultValue: source.group.id,
      defaultDisplay: source.group.name,

      value: 'id',
      QUERY: gql`
        query FindReferenceFieldQueryNewGroupRoleGroup(
          $filter: String
          $skip: Int
        ) {
          search: groups(filter: $filter, skip: $skip) {
            count
            take
            skip
            results {
              id
              name
            }
          }
        }
      `,
    },
  ]

  const roles = {
    update: ['sourceUpdate'],
    delete: ['sourceDelete'],
  }

  return (
    <Fragment>
      <MetaTags
        title={`source.id`}
        description="Replace me with 155 charactes about this page"
      />

      <FormComponent
        record={source}
        fields={fields}
        roles={roles}
        onSubmit={onSubmit}
        onDelete={onDelete}
        loading={loading}
        error={error}
        returnLink={routes.sources()}
      />
    </Fragment>
  )
}
