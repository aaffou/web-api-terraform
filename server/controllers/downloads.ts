import { deleteUrlToDynamo, addUrlToDynamo, listUrlsToDynamo } from '../services/downloadsDynamo'
import { addUrlToFile, fetchUrlsFromFile, deleteUrlFromFile } from '~/server/services/downloadsJson'
import { EnumfileToUse } from '~/types/types'
const doneFile = EnumfileToUse[EnumfileToUse.done] as keyof typeof EnumfileToUse
const toDoFile = EnumfileToUse[EnumfileToUse.toDo] as keyof typeof EnumfileToUse
export const addToDownloads = async (url:string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode detected. Adding URL to Json file.')
    await addUrlToFile(url, toDoFile)
  } else {
    await addUrlToDynamo(url, toDoFile)
    console.log('Not in development mode. URL addition going AWS Mode.')
  }
}

export const listDownloads = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode detected. Fetching URLs from Json file.')
    return await fetchUrlsFromFile(toDoFile)
  } else {
    return await listUrlsToDynamo(toDoFile)
    console.log('Not in development mode. URL fetching going AWS Mode.')
  }
}

export const moveDownloadToDone = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode detected. Fetching URLs from Json file.')
    const urls = await fetchUrlsFromFile(toDoFile)
    if (urls.length > 0) {
      const firstUrl = urls[0]
      await addUrlToFile(firstUrl, doneFile)
      console.log('URLs:', urls)
      await deleteUrlFromFile(firstUrl, toDoFile)
    }
  } else {
    const urls = await listUrlsToDynamo(toDoFile)
    if (urls.length > 0) {
      const firstUrl = urls[0]
      await addUrlToDynamo(firstUrl, doneFile)
      console.log('URLs:', urls)
      await deleteUrlToDynamo(firstUrl, toDoFile)
    }
    console.log('Not in development mode. URL fetching going AWS Mode.')
  }
}
