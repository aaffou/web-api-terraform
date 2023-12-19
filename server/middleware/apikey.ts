export default defineEventHandler((event) => {
  const xApiKey = getHeader(event, 'x-api-key')
  const runtimeConfig = useRuntimeConfig()
  if (xApiKey !== runtimeConfig.API_KEY) {
    return sendError(event, {
      statusCode: 401,
      message: 'Unauthorised',
      name: 'Unauthorised',
      statusMessage: 'Wrong X API KEY'
    })
  }
})
