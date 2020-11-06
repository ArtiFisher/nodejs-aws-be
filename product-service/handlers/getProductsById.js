import { StatusCodes } from 'http-status-codes';
import { dbOptions } from '../utils/db-connect.js';
import { Client } from 'pg';

export const handler = async event => {
  let body;
  let statusCode;
  const client = new Client(dbOptions);
  console.log(event);
  try {
    await client.connect();
    const searchResult = (await client.query('SELECT * from products WHERE id = $1', [event.pathParameters?.productId]))
    if (searchResult.rowCount > 0) {
      statusCode = StatusCodes.OK;
      body = JSON.stringify(searchResult.rows);
    } else {
      statusCode = StatusCodes.NOT_FOUND;
      body = JSON.stringify({ message: 'Product not found' });
    }
  } catch(e) {
    body = JSON.stringify(e);
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  finally {
    client.end();
  }
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body,
    statusCode,
  };
};
