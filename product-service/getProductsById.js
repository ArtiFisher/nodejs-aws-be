import products from './productList.json';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line import/prefer-default-export
export const handler = async event => {
  let body;
  let statusCode;
  try {
    body = await new Promise(resolve => {
      const searchResult = JSON.stringify(products.find(product => product.id === event.pathParameters?.productId))
      if (searchResult) {
        resolve(searchResult);
        statusCode = StatusCodes.OK;
      } else {
        resolve(JSON.stringify({ message: 'Product not found' }));
        statusCode = StatusCodes.NOT_FOUND;
      }
    });
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
