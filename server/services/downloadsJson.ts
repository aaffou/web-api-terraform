import { promises as fs } from 'fs'
import { EnumfileToUse } from '~/types/types'
const toDoJsonFilePath = 'assets/toDoDownloads.json'
const doneDownlaods = 'assets/doneDownloads.json'
export async function addUrlToFile (url: string, fileToUse: keyof typeof EnumfileToUse): Promise<void> {
  try {
    const data = await fs.readFile(getFilePath(fileToUse), 'utf8')
    const urls: string[] = JSON.parse(data)

    if (!urls.includes(url)) {
      urls.push(url)
      await fs.writeFile(getFilePath(fileToUse), JSON.stringify(urls, null, 2))
      console.log(`URL added: ${url}`)
    } else {
      console.log(`URL already exists in the file: ${url}`)
    }
  } catch (error) {
    console.error(`Error adding URL to the file: ${error}`)
  }
}

export async function fetchUrlsFromFile (fileToUse: keyof typeof EnumfileToUse): Promise<string[]> {
  try {
    const data = await fs.readFile(getFilePath(fileToUse), 'utf8')
    const urls: string[] = JSON.parse(data)
    return urls
  } catch (error) {
    console.error(`Error fetching URLs from the file: ${error}`)
    return []
  }
}

export async function deleteUrlFromFile (url: string, fileToUse: keyof typeof EnumfileToUse): Promise<void> {
  try {
    const data = await fs.readFile(getFilePath(fileToUse), 'utf8')
    let urls: string[] = JSON.parse(data)

    if (urls.includes(url)) {
      urls = urls.filter(u => u !== url)
      await fs.writeFile(getFilePath(fileToUse), JSON.stringify(urls, null, 2))
      console.log(`URL deleted: ${url}`)
    } else {
      console.log(`URL not found in the file: ${url}`)
    }
  } catch (error) {
    console.error(`Error deleting URL from the file: ${error}`)
  }
}

const getFilePath = (fileToUse : keyof typeof EnumfileToUse) => {
  if (fileToUse === EnumfileToUse[EnumfileToUse.done]) {
    return doneDownlaods
  }
  return toDoJsonFilePath
}
