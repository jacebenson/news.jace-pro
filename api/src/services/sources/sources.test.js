import {
  sources,
  source,
  createSource,
  updateSource,
  deleteSource,
} from './sources'

describe('sources', () => {
  scenario('returns all sources', async (scenario) => {
    const result = await sources()

    expect(result.length).toEqual(Object.keys(scenario.source).length)
  })

  scenario('returns a single source', async (scenario) => {
    const result = await source({ id: scenario.source.one.id })

    expect(result).toEqual(scenario.source.one)
  })

  scenario('creates a source', async () => {
    const result = await createSource({
      input: {
        updatedAt: '2022-01-02T03:57:41Z',
        title: 'String',
        feedLink: 'String',
      },
    })

    expect(result.updatedAt).toEqual('2022-01-02T03:57:41Z')
    expect(result.title).toEqual('String')
    expect(result.feedLink).toEqual('String')
  })

  scenario('updates a source', async (scenario) => {
    const original = await source({ id: scenario.source.one.id })
    const result = await updateSource({
      id: original.id,
      input: { updatedAt: '2022-01-03T03:57:41Z' },
    })

    expect(result.updatedAt).toEqual('2022-01-03T03:57:41Z')
  })

  scenario('deletes a source', async (scenario) => {
    const original = await deleteSource({ id: scenario.source.one.id })
    const result = await source({ id: original.id })

    expect(result).toEqual(null)
  })
})
