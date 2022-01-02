import {
  articles,
  article,
  createArticle,
  updateArticle,
  deleteArticle,
} from './articles'

describe('articles', () => {
  scenario('returns all articles', async (scenario) => {
    const result = await articles()

    expect(result.length).toEqual(Object.keys(scenario.article).length)
  })

  scenario('returns a single article', async (scenario) => {
    const result = await article({ id: scenario.article.one.id })

    expect(result).toEqual(scenario.article.one)
  })

  scenario('creates a article', async (scenario) => {
    const result = await createArticle({
      input: {
        updatedAt: '2022-01-02T04:18:41Z',
        title: 'String',
        link: 'String',
        sourceId: scenario.article.two.sourceId,
      },
    })

    expect(result.updatedAt).toEqual('2022-01-02T04:18:41Z')
    expect(result.title).toEqual('String')
    expect(result.link).toEqual('String')
    expect(result.sourceId).toEqual(scenario.article.two.sourceId)
  })

  scenario('updates a article', async (scenario) => {
    const original = await article({ id: scenario.article.one.id })
    const result = await updateArticle({
      id: original.id,
      input: { updatedAt: '2022-01-03T04:18:41Z' },
    })

    expect(result.updatedAt).toEqual('2022-01-03T04:18:41Z')
  })

  scenario('deletes a article', async (scenario) => {
    const original = await deleteArticle({ id: scenario.article.one.id })
    const result = await article({ id: original.id })

    expect(result).toEqual(null)
  })
})
