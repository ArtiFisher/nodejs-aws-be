import products from './productList.json';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  let body;
  let statusCode;
  try {
    body = JSON.stringify(products);
    statusCode = StatusCodes.OK
  } catch(e) {
    body = JSON.stringify(e);
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
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
