import { listDownloads } from '~/server/controllers/downloads'
export default defineEventHandler((event) => {
  return listDownloads().then((urls) => {
    return urls
  }).catch((err) => {
    console.error(err)
    sendError(event, err)
  })
})
