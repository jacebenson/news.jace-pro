import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import { Fragment } from 'react'
import FormComponent from 'src/components/FormComponent'

const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticleMutation($input: CreateArticleInput!) {
    createArticle(input: $input) {
      id
    }
  }
`

const NewArticle = () => {
  const [createArticle, { loading, error }] = useMutation(
    CREATE_ARTICLE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Article created')
        navigate(routes.articles())
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
    const castInput = Object.assign(input, {
      sourceId: parseInt(input.sourceId),
    })
    createArticle({ variables: { input: castInput } })
  }
  const fields = [
    {
      name: 'title',
      prettyName: 'Title',
    },
    {
      name: 'link',
      prettyName: 'Link',
    },
    {
      name: 'sourceId',
      prettyName: 'Source id',
    },
  ]

  const roles = {
    update: ['articleUpdate'],
    delete: ['articleDelete'],
  }

  return (
    <Fragment>
      <MetaTags
        title="New Article"
        description="New Article form"
        /* you should un-comment description and add a unique description, 155 characters or less
      You can look at this documentation for best practices : https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets */
      />

      <FormComponent
        fields={fields}
        roles={roles}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        returnLink={routes.articles()}
      />
    </Fragment>
  )
}

export default NewArticle
