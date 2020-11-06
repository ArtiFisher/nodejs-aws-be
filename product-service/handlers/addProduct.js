import { StatusCodes } from 'http-status-codes';
import { dbOptions } from '../utils/db-connect.js';
import { Client } from 'pg';

const defaultImage = "https://cdn.mos.cms.futurecdn.net/MMwRCjVEaoJPP4dBBugWFY-1200-80.jpg";

export const handler = async event => {
  let body;
  let statusCode;
  const client = new Client(dbOptions);
  console.log(event);
  try {
    const { title, image = defaultImage, description = "", price = 9.99, count = 0 } = JSON.parse(event.body);
    if (!title || !Number.isInteger(count)) {
      statusCode = StatusCodes.BAD_REQUEST;
      body = JSON.stringify({ message: 'Product data is invalid' });
    }
    else {
      await client.connect();
      await client.query('BEGIN');
      const productRecord = await client.query(
        'insert into products (title, image, description, price) values ($1, $2, $3, $4) RETURNING id',
        [title, image, description, price]
      );
      await client.query(
        'insert into stocks (product_id, count) values ($1, $2)',
        [productRecord.rows[0].id, count]
      );
      await client.query('COMMIT');

      statusCode = StatusCodes.OK;
      body = JSON.stringify({ message: 'Transaction successfully completed.' });
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
