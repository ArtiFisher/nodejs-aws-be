import { StatusCodes } from 'http-status-codes';
import AWS from 'aws-sdk';
import { headers } from '../../utils/const.js';

const S3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });

export const handler = async event => {
  let body;
  let statusCode;
  console.log(event);
  try {
    const params = {
      Key: `uploaded/${event.queryStringParameters?.name}`,
      Bucket: 'imported-products',
      Expires: 60,
      ContentType: 'text/csv'
    }
    body = await S3.getSignedUrlPromise('putObject', params);
    statusCode = StatusCodes.OK;
  } catch(e) {
    body = JSON.stringify(e);
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  return {
    headers,
    body,
    statusCode,
  };
};
