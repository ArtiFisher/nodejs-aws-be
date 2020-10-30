import * as products from './productList.json';

// eslint-disable-next-line import/prefer-default-export
export const handler = async event => {
  const searchResult = await new Promise(resolve => {
    resolve(products.find(product => product.id === event.pathParameters?.productId));
  });
  return {
    isBase64Encoded: false,
    headers: {},
    statusCode: 200,
    body: JSON.stringify(searchResult),
  };
};
