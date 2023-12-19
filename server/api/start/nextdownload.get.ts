import { moveDownloadToDone } from '~/server/controllers/downloads'
export default defineEventHandler((event) => {
  return moveDownloadToDone().then(() => {
    return 'Done'
  }).catch((err) => {
    console.error(err)
    sendError(event, err)
  })
})
