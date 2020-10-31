import products from './productList.json';

// eslint-disable-next-line import/prefer-default-export
export const handler = async () => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
    body: JSON.stringify(products),
  };
};
