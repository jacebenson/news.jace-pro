import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'
import FormComponent from 'src/components/FormComponent'

import { Fragment } from 'react'

export const QUERY = gql`
  query EditArticleById($id: Int!) {
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
const UPDATE_ARTICLE_MUTATION = gql`
  mutation UpdateArticleMutation($id: Int!, $input: UpdateArticleInput!) {
    updateArticle(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      title
      link
      sourceId
    }
  }
`
export const DELETE_ARTICLE_MUTATION = gql`
  mutation DeleteArticleMutation($id: Int!) {
    deleteArticle(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error.message}</div>
)

export const Success = ({ article }) => {
  const [updateArticle, { loading, error }] = useMutation(
    UPDATE_ARTICLE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Article updated')
        navigate(routes.articles())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSubmit = (data) => {
    console.log('saving', data)
    /**TODO: FEAT Client Rules go here */
    onSave(data, article.id)
  }
  const onSave = (input, id) => {
    const castInput = Object.assign(input, {
      sourceId: parseInt(input.sourceId),
    })
    updateArticle({ variables: { id, input: castInput } })
  }

  const [deleteArticle] = useMutation(DELETE_ARTICLE_MUTATION, {
    onCompleted: () => {
      toast.success('Article deleted')
      navigate(routes.articles())
    },
  })

  const onDelete = (id) => {
    if (confirm('Are you sure you want to delete Article ' + id + '?')) {
      deleteArticle({ variables: { id } })
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
    update: ['articleUpdate'],
    delete: ['articleDelete'],
  }

  return (
    <Fragment>
      <MetaTags
        title={`article.id`}
        description="Replace me with 155 charactes about this page"
      />

      <FormComponent
        record={article}
        fields={fields}
        roles={roles}
        onSubmit={onSubmit}
        onDelete={onDelete}
        loading={loading}
        error={error}
        returnLink={routes.articles()}
      />
    </Fragment>
  )
}
