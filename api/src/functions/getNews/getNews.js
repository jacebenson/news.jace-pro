import { logger } from 'src/lib/logger'
import { db } from 'src/lib/db'
import { article, upsertArticle } from 'src/services/articles'
/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
//  //await db.article.createMany({
//  //  data: [items],
//  //  skipDuplicates: true,
//  //})
let Parser = require('rss-parser')
let parser = new Parser({
  timeout: 3000, // 3 seconds is all I'll wait for a response
  requestOptions: {
    rejectUnauthorized: false,
  },
})
export const handler = async (event, context) => {
  console.log('stated getnews')
  let sources = await db.source.findMany({})
  //sources.length = 1
  let items = []
  let rawItems = []
  for (let source of sources) {
    try {
      console.log('trying', source.feedLink)
      let feed = await parser.parseURL(source.feedLink)
      for (let item of feed.items) {
        rawItems.push(item)

        items.push({
          // common rss properties to add
          title: item.title,
          description: item.description,
          link: item?.link || item?.enclosure?.url,
          createdAt: new Date(item.pubDate),
          sourceId: source.id,
        })
        //}
      }
    } catch (error) {
      logger.error(error)
      console.log(error)
    }
  }
  console.log('items', items.length)
  // remove things from before today
  items = items.filter((item) => {
    return item.createdAt > new Date()
  })
  console.log('items', items)

  //await db.article.deleteMany({})
  let result = await db.article.createMany({
    data: items,
    skipDuplicates: true,
  })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },

    //body: JSON.stringify({
    //  data: items,
    //}),
    body: { result, sources, items: items.length, rawItems: rawItems.length },
  }
}
