import { StatusCodes } from 'http-status-codes';
import AWS from 'aws-sdk';
import { headers, csvBucket } from '../../utils/const.js';
import csv from 'csv-parser';

const S3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });

export const handler = async event => {
  let body;
  let statusCode;
  try {
    const record = event.Records[0];
    await new Promise((resolve, reject) => {
      S3.getObject({
        Bucket: csvBucket,
        Key: record.s3.object.key
      })
        .createReadStream()
        .pipe(csv())
        .on('data', console.dir)
        .on('end', async () => {
          await S3.copyObject({
            Bucket: csvBucket,
            CopySource: `${csvBucket}/${record.s3.object.key}`,
            Key: record.s3.object.key.replace('uploaded', 'parsed')
          }).promise();
          await S3.deleteObject({
            Bucket: csvBucket,
            Key: record.s3.object.key
          }).promise();
          resolve();
        })
    })
    body = JSON.stringify(event);
    statusCode = StatusCodes.OK;
  } catch(e) {
    body = JSON.stringify(event);
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  return {
    headers,
    body,
    statusCode,
  };
};
