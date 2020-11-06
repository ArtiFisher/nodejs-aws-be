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
    body = JSON.stringify((await client.query('SELECT * from products')).rows);
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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body,
    statusCode,
  };
};
