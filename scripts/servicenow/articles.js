import { db } from '$api/src/lib/db'
export default async ({ args }) => {
  console.log('in buildsncontents')
  var http = require('https')
  //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
  var items = []
  var users = []
  // get count to start...
  var getNowArticles = function (start, callback) {
    if (!start) {
      start = 0
    }
    var end = parseInt(start, 10) + 1000
    var options = {
      method: 'GET',
      hostname: 'community.servicenow.com',
      //path: "/api/sn_communities/v1/community/contents?last=" + end + "&stFrom=" + start + "&before=" + new Date().toISOString() + "&forum=&type=5eaa334a5f10030069c587dc3f73130b&user=" + user + "&state=all&filters=undefined",
      path:
        '/api/sn_communities/v1/community/contents?last=' +
        end +
        '&stFrom=' +
        start +
        '&before=' +
        new Date().toISOString() +
        '&forum=&type=5eaa334a5f10030069c587dc3f73130b&sort=created&filters=undefined',
      headers: {
        Accept: '*/*',
        'Cache-Control': 'no-cache',
        Host: 'community.servicenow.com',
        //"Accept-Encoding": "gzip, deflate",
        Connection: 'keep-alive',
        'cache-control': 'no-cache',
        'content-type': 'application/json; charset=utf-8',
      },
    }
    //var recurseHttpRequest = function();

    var req = http.request(options, function (res) {
      var chunks = []

      res.on('data', function (chunk) {
        chunks.push(chunk)
      })

      res.on('end', async () => {
        var body = Buffer.concat(chunks)
        //console.log(body.toString());
        var responseObj = JSON.parse(body)

        //console.log(responseObj.result.nextRecord, 'ServiceNow Community Articles - ' + user)

        console.log(
          (start, '/', responseObj.result.nextRecord),
          'ServiceNow Articles'
        )
        let linkUrl =
          'https://community.servicenow.com/community?id=community_article&sys_id='
        responseObj.result.contents.forEach(function (post) {
          items.push({
            title: post.title,
            description: post?.description,
            createdAt: new Date(post.published_date),
            sourceId: 107,
            author: post.userAvatarObject, //.name,
            link: linkUrl + post.sys_id,
          })
        })
        console.log('items', items.length)
        console.log(
          items[items.length - 1].title,
          items[items.length - 1].author,
          items[items.length - 1].link
        )
        items.forEach(async (item) => {
          let result = await db.article.upsert({
            where: { link: item.link },
            create: {
              title: item.title,
              createdAt: item.createdAt,
              sourceId: item.sourceId,
              link: item.link,
              Participant: {
                create: [
                  {
                    user: {
                      create: {
                        name: item.author?.name || item.author?.initials,
                        email: `${item.author?.userId}@example.com`,
                      },
                    },
                  },
                ],
              },
            },
            update: {
              title: item.title,
              createdAt: item.createdAt,
              sourceId: item.sourceId,
              link: item.link,
              Participant: {
                connectOrCreate: {
                  where: {
                    user: { email: `${item.author?.userId}@example.com` },
                  },
                  create: {
                    user: {
                      connectOrCreate: {
                        where: { email: `${item.author?.userId}@example.com` },
                        create: {
                          name: item.author?.name || item.author?.initials,
                          email: `${item.author?.userId}@example.com`,
                        },
                      },
                    },
                  },
                },

                //create: [
                //  {
                //    user: {
                //      connectOrCreate: {
                //        where: { email: `${item.author?.userId}@example.com` },
                //        create: {
                //          name: item.author?.name || item.author?.initials,
                //          email: `${item.author?.userId}@example.com`,
                //        },
                //      },
                //    },
                //  },
                //],
              },
            },
          })
          console.log(result)
        })
        //console.log('items', items[0], items[999])
        //let result = await db.article.createMany({
        //  data: items,
        //  skipDuplicates: true,
        //})
        //console.log('result', result)
        //callbackFinal()
      })
    })
    req.end()
  }
  //users.forEach(function(user){
  getNowArticles(null, null)
  //})
}
