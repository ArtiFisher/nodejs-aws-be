import { StatusCodes } from 'http-status-codes';
import { Client } from 'pg';
import AWS from 'aws-sdk';
import { dbOptions } from '../../utils/db-connect.js';
import { headers } from '../../utils/const.js'

const defaultImage = "https://cdn.mos.cms.futurecdn.net/MMwRCjVEaoJPP4dBBugWFY-1200-80.jpg";
const sns = new AWS.SNS({ apiVersion: '2010-03-31', region: 'eu-west-1' });

export const handler = async event => {
  let body;
  let statusCode;
  const client = new Client(dbOptions);
  console.log(JSON.stringify(event));
  try {
    await client.connect();
    await client.query('BEGIN');
    await Promise.all(event.Records.map(async record => {
      const body = JSON.parse(record.body);
      const { title, image = defaultImage, description = "", price = 9.99, count = 0 } = body;
      if (!title || !Number.isInteger(Number(count))) {
        return Promise.reject()
      }
      else {
        const productRecord = await client.query(
          'insert into products (title, image, description, price) values ($1, $2, $3, $4) RETURNING id',
          [title, image, description, price]
        );
        await client.query(
          'insert into stocks (product_id, count) values ($1, $2)',
          [productRecord.rows[0].id, count]
        );
        return Promise.resolve(body);
      }
    }))
    .catch(async (error, data) => {
      console.log(error, data);
      statusCode = StatusCodes.BAD_REQUEST;
      body = JSON.stringify({ message: 'Product data is invalid' });
      await client.query('ROLLBACK');
    })
    client.query('COMMIT');
    await sns.publish({
      Subject: 'Game store news',
      Message: 'New games were added',
      TopicArn: process.env.SNS_TOPIC
    }).promise();
    body = JSON.stringify({ message: 'Transaction successfully completed.' });
    statusCode = StatusCodes.OK;
  } catch(error) {
    console.log('rollback');
    console.log(error);
    await client.query('ROLLBACK');
    body = JSON.stringify(error); 
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
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
