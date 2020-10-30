import * as products from './productList.json';

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  return {
    isBase64Encoded: false,
    headers: {},
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
