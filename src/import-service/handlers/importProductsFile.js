import { StatusCodes } from 'http-status-codes';
import { headers } from '../../utils/const.js';

export const handler = async event => {
  let body;
  let statusCode;
  console.log(event);
  try {
    statusCode = StatusCodes.OK;
    body = JSON.stringify({ message: 'Ok' });
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
