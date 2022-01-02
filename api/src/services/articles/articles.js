import { db } from 'src/lib/db'
import { UserInputError } from '@redwoodjs/graphql-server'
import {
  executeBeforeCreateRules,
  executeAfterCreateRules,
  executeBeforeReadAllRules,
  executeAfterReadAllRules,
  executeBeforeReadRules,
  executeAfterReadRules,
  executeBeforeUpdateRules,
  executeAfterUpdateRules,
  executeBeforeDeleteRules,
  executeAfterDeleteRules,
} from 'src/lib/rules'

let table = 'article'

export const createArticle = async ({ input }) => {
  let table = 'article'
  console.log('createArticle input', input)
  try {
    let result = await executeBeforeCreateRules(table, {
      input,
      status: { code: 'success', message: '' },
    })

    if (result.status.code !== 'success') {
      throw new UserInputError(result.status.message)
    }
    let record = await db[table].create({
      data: result.input,
    })

    let afterResult = await executeAfterCreateRules(table, {
      record,
    })

    return afterResult.record
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export const createManyArticles = async ({ input }) => {
  let table = 'article'
  console.log('createManyArticles input', input)
  try {
    //let result = await executeBeforeCreateRules(table, {
    //  input,
    //  status: { code: 'success', message: '' },
    //})

    //if (result.status.code !== 'success') {
    //  throw new UserInputError(result.status.message)
    //}
    let record = await db[table].createMany({
      data: input,
    })

    //let afterResult = await executeAfterCreateRules(table, {
    //  record,
    //})

    return record
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export const upsertArticle = async ({ input }) => {
  let table = 'article'
  try {
    let result = await executeBeforeCreateRules(table, {
      input,
      status: { code: 'success', message: '' },
    })

    if (result.status.code !== 'success') {
      throw new UserInputError(result.status.message)
    }
    console.log('trying to create', input)
    let record = await db[table].upsert({
      where: { link: input.link },
      update: { ...input },
      create: { ...input },
      // data: result.input,
    })

    let afterResult = await executeAfterCreateRules(table, {
      record,
    })

    return afterResult.record
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export const articles = async ({ filter, skip, orderBy, q }) => {
  try {
    let preferences = context.currentUser.preferences
    let take = (() => {
      let limit = parseInt(preferences['user.pageSize'], 10) || 10
      if (limit > 100) {
        return 100 //return 100 or limit whatever is smaller
      } else {
        return limit
      }
    })()
    let where = (() => {
      try {
        let returnObject = {}
        if (filter) {
          let OR = [
            { title: { contains: filter, mode: 'insensitive' } },
            { source: { title: { contains: filter, mode: 'insensitive' } } },
          ]
          let castFilter = parseInt(filter, 10)
          if (isNaN(castFilter) === false) {
            OR.push({ id: { equals: castFilter } })
          }
          returnObject.parsed = { OR }
        }
        if (q) {
          returnObject.parsed = JSON.parse(q)
        }
        return returnObject
      } catch (error) {
        console.log(error)
        return {}
      }
    })()
    if (!skip) skip = 0
    let result = await executeBeforeReadAllRules(table, {
      status: { code: 'success', message: '' },
    })

    if (result.status.code !== 'success') {
      throw new UserInputError(result.status.message)
    }
    let readRecords = await db[table].findMany({
      take,
      where: where.parsed,
      orderBy,
      skip,
    })

    let count = await db[table].count({ where: where.parsed })
    let results = {
      results: readRecords,
      count,
      take,
      skip,
      q: JSON.stringify(where.parsed),
    }

    readRecords = executeAfterReadAllRules(table, readRecords)
    return results
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export const article = async ({ id }) => {
  try {
    let result = await executeBeforeReadRules(table, {
      id,
      status: { code: 'success', message: '' },
    })

    if (result.status.code !== 'success') {
      throw new UserInputError(result.status.message)
    }
    let readRecord = await db[table].findUnique({
      where: { id },
    })

    readRecord = executeAfterReadRules(table, readRecord)
    return readRecord
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export const updateArticle = async ({ id, input }) => {
  try {
    let result = await executeBeforeUpdateRules(table, {
      id,
      input,
      status: { code: 'success', message: '' },
    })

    if (result.status.code !== 'success') {
      throw new UserInputError(result.status.message)
    }
    let updatedRecord = await db[table].update({
      data: result.input,
      where: { id },
    })

    updatedRecord = executeAfterUpdateRules(table, updatedRecord)
    return updatedRecord
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export const deleteArticle = async ({ id }) => {
  try {
    let result = await executeBeforeDeleteRules(table, {
      id,
      status: { code: 'success', message: '' },
    })

    if (result.status.code !== 'success') {
      throw new UserInputError(result.status.message)
    }
    let deletedRecord = await db[table].delete({
      where: { id },
    })

    deletedRecord = executeAfterDeleteRules(table, deletedRecord)
    return deletedRecord
  } catch (error) {
    throw new UserInputError(error.message)
  }
}

export const Article = {
  source: (_obj, { root }) =>
    db[table].findUnique({ where: { id: root.id } }).source(),
}
