import { StatusCodes } from 'http-status-codes';
import AWS from 'aws-sdk';
import { headers, csvBucket } from '../../utils/const.js';
import csv from 'csv-parser';

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'eu-west-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'eu-west-1' });

const sendCSVRow = row =>{
  const sentRow = JSON.stringify(row);
  sqs.sendMessage({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: sentRow
  }, (err, response) => {
    console.log(sentRow)
    err && console.dir(err)
    console.dir(response)
  })
}

export const handler = async event => {
  let body;
  let statusCode;
  try {
    const record = event.Records[0];
    await new Promise(resolve => {
      s3.getObject({
        Bucket: csvBucket,
        Key: record.s3.object.key
      })
        .createReadStream()
        .pipe(csv())
        .on('data', sendCSVRow)
        .on('end', async () => {
          await s3.copyObject({
            Bucket: csvBucket,
            CopySource: `${csvBucket}/${record.s3.object.key}`,
            Key: record.s3.object.key.replace('uploaded', 'parsed')
          }).promise();
          await s3.deleteObject({
            Bucket: csvBucket,
            Key: record.s3.object.key
          }).promise();
          resolve();
        })
    })
    console.dir(event)
    body = JSON.stringify(event);
    statusCode = StatusCodes.OK;
  } catch(e) {
    console.dir(e)
    body = JSON.stringify(e);
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  return {
    headers,
    body,
    statusCode,
  };
};
