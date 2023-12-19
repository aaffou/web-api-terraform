import { addToDownloads } from '~/server/controllers/downloads'
export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  return addToDownloads(url).then(() => {
    return 'Url added.'
  }).catch((err) => {
    console.error(err)
    sendError(event, err)
  })
})
