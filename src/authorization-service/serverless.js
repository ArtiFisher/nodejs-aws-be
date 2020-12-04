'use strict';

module.exports = {
  service: {
    name: 'authorization-service'
  },
  frameworkVersion: '2',
  plugins: ['serverless-dotenv-plugin', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
  },
  functions: {
    basicAuthorizer: {
      handler: 'handlers/basicAuthorizer.handler'
    },
  },
  resources: {
    Outputs: {
      BasicAuthorizer: {
        Value: {
          'Fn::GetAtt': [ 'basicAuthorizer', 'Arn' ]
        }
      }
    },
  },
};
