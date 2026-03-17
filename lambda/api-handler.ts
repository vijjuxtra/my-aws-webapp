
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({});
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === 'GET') {
    const data = await client.send(new ScanCommand({ TableName: TABLE_NAME }));
    return { statusCode: 200, body: JSON.stringify(data.Items) };
  }
  return { statusCode: 200, body: 'OK' };
};
