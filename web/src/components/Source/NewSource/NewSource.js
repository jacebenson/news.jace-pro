import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import { Fragment } from 'react'
import FormComponent from 'src/components/FormComponent'

const CREATE_SOURCE_MUTATION = gql`
  mutation CreateSourceMutation($input: CreateSourceInput!) {
    createSource(input: $input) {
      id
    }
  }
`

const NewSource = () => {
  const [createSource, { loading, error }] = useMutation(
    CREATE_SOURCE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Source created')
        navigate(routes.sources())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSubmit = (data) => {
    /**TODO: FEAT Client Rules go here */
    onSave(data)
  }

  const onSave = (input) => {
    console.log('input', input)
    createSource({ variables: { input } })
  }
  const fields = [
    {
      name: 'title',
      prettyName: 'Title',
    },
    {
      name: 'feedLink',
      prettyName: 'Feed link',
    },
  ]

  const roles = {
    update: ['sourceUpdate'],
    delete: ['sourceDelete'],
  }

  return (
    <Fragment>
      <MetaTags
        title="New Source"
        description="New Source form"
        /* you should un-comment description and add a unique description, 155 characters or less
      You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
      />

      <FormComponent
        fields={fields}
        roles={roles}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        returnLink={routes.sources()}
      />
    </Fragment>
  )
}

export default NewSource
