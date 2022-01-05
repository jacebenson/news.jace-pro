// To access your database
import { db } from '$api/src/lib/db'
import { logger } from 'src/lib/logger'
let Parser = require('rss-parser')
let parser = new Parser({
  timeout: 3000, // 3 seconds is all I'll wait for a response
  requestOptions: {
    rejectUnauthorized: false,
  },
})
export default async ({ args }) => {
  console.log(args)
  // Your script here...
  console.log(':: Executing script with args ::')
  console.log(args._[1])
  console.log('stated getnews')
  let sources = await db.source.findMany({})
  //sources.length = 1
  let items = []
  let rawItems = []
  for (let source of sources) {
    try {
      console.log(
        `trying https://new.jace.pro/source/${source.id} ${source.feedLink}`
      )
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
  //items = items.filter((item) => {
  //  return item.createdAt > new Date()
  //})
  //console.log('items', items)
  //await db.article.deleteMany({})

  // lets get servicenow articles and blogs

  let result = await db.article.createMany({
    data: items,
    skipDuplicates: true,
  })
  console.log('result', result)
}
