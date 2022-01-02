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
    updateSource({ variables: { id, input } })
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
      name: 'field',
      prettyName: 'Field',
      required: 'message to show when empty',
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
