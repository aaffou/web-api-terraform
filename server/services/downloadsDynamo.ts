import * as AWS from 'aws-sdk'
import { EnumfileToUse } from '~/types/types'

AWS.config.update({ region: 'us-west-2' })

// eslint-disable-next-line import/namespace
const ddb = new AWS.DynamoDB.DocumentClient()

const toDoTableName = 'to-do-downloads'
const doneTableName = 'done-downloads'
const recordId = 'urls_record'

export async function addUrlToDynamo (url: string, tableToUse: keyof typeof EnumfileToUse): Promise<void> {
  const params = {
    TableName: getFilePath(tableToUse),
    Key: { id: recordId },
    UpdateExpression: 'ADD urls :url',
    ExpressionAttributeValues: {
      ':url': ddb.createSet([url])
    },
    ReturnValues: 'UPDATED_NEW'
  }

  try {
    await ddb.update(params).promise()
    console.log(`URL added: ${url}`)
  } catch (error) {
    console.error(`Error adding URL: ${error}`)
  }
}

export async function listUrlsToDynamo (tableToUse: keyof typeof EnumfileToUse): Promise<string[]> {
  const params = {
    TableName: getFilePath(tableToUse),
    Key: { id: recordId }
  }

  try {
    const data = await ddb.get(params).promise()
    return data.Item ? data.Item.urls.values : []
  } catch (error) {
    console.error(`Error listing URLs: ${error}`)
    return []
  }
}

export async function deleteUrlToDynamo (url: string, tableToUse: keyof typeof EnumfileToUse): Promise<void> {
  const params = {
    TableName: getFilePath(tableToUse),
    Key: { id: recordId },
    UpdateExpression: 'DELETE urls :url',
    ExpressionAttributeValues: {
      ':url': ddb.createSet([url])
    }
  }

  try {
    await ddb.update(params).promise()
    console.log(`URL deleted: ${url}`)
  } catch (error) {
    console.error(`Error deleting URL: ${error}`)
  }
}
const getFilePath = (fileToUse : keyof typeof EnumfileToUse) => {
  if (fileToUse === EnumfileToUse[EnumfileToUse.done]) {
    return doneTableName
  }
  return toDoTableName
}

// addUrl('http://example.com')
// listUrls().then(urls => console.log(urls))
// deleteUrl('http://example.com')
