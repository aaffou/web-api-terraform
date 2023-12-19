import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { EnumfileToUse } from '~/types/types'

const ddbClient = new DynamoDBClient({ region: 'eu-west-1' }) // Change to your region
const docClient = DynamoDBDocumentClient.from(ddbClient)
const toDoTableName = 'to-do-downloads'
const doneTableName = 'done-downloads'
const recordId = 'urls_record'

export async function addUrlToDynamo (url: string, tableToUse: keyof typeof EnumfileToUse): Promise<void> {
  const params = {
    TableName: getFilePath(tableToUse),
    Key: { urls_record: recordId },
    UpdateExpression: 'ADD urls :url',
    ExpressionAttributeValues: {
      ':url': new Set([url])
    }
  }

  try {
    await docClient.send(new UpdateCommand(params))
    console.log(`URL added: ${url}`)
  } catch (error) {
    console.error(`Error adding URL: ${error}`)
  }
}

export async function listUrlsToDynamo (tableToUse: keyof typeof EnumfileToUse): Promise<string[]> {
  const params = {
    TableName: getFilePath(tableToUse),
    Key: { urls_record: recordId }
  }

  try {
    const data = await docClient.send(new GetCommand(params))
    return data.Item ? Array.from(data.Item.urls) : []
  } catch (error) {
    console.error(`Error listing URLs: ${error}`)
    return []
  }
}

export async function deleteUrlToDynamo (url: string, tableToUse: keyof typeof EnumfileToUse): Promise<void> {
  const params = {
    TableName: getFilePath(tableToUse),
    Key: { urls_record: recordId },
    UpdateExpression: 'DELETE urls :url',
    ExpressionAttributeValues: {
      ':url': new Set([url])
    }
  }

  try {
    await docClient.send(new UpdateCommand(params))
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
