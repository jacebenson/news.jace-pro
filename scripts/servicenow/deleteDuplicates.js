import { db } from '$api/src/lib/db'
export default async ({ args }) => {
  let result = await db.article.deleteMany({
    where: { link: { contains: 'community_content' } },
  })
  console.log(result)
}
