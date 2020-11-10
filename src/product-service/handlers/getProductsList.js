import { StatusCodes } from 'http-status-codes';
import { dbOptions } from '../utils/db-connect.js';
import { Client } from 'pg';
import { headers } from '../utils/const.js'

export const handler = async event => {
  let body;
  let statusCode;
  const client = new Client(dbOptions);
  console.log(event);
  try {
    await client.connect();
    body = JSON.stringify((await client.query(
        'SELECT id, title, image, description, price, count from products INNER JOIN stocks ON products.id = stocks.product_id')
      ).rows);
    statusCode = StatusCodes.OK
  } catch(e) {
    body = JSON.stringify(e);
    console.log(e);
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }
  finally {
    client.end();
  }
  return {
    headers,
    body,
    statusCode,
  };
};
