'use strict';

module.exports = {
  service: {
    name: 'import-service',
  },
  frameworkVersion: '2',
  plugins: ['serverless-dotenv-plugin', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: "arn:aws:s3:::imported-products/*",
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: "${cf:product-service-${self:provider.stage}.CatalogItemsQueueArn}",
      },
    ],
  },
  functions: {
    importProductsFile: {
      handler: 'handlers/importProductsFile.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
          }
        }
      ]
    },
    parseImportedFile: {
      handler: 'handlers/importFileParser.handler',
      events: [{
        s3: {
          bucket: 'imported-products',
          event: 's3:ObjectCreated:*',
          rules: [{
            prefix: 'uploaded/',
          }],
          existing: true,
        }
      }]
    },
  },
};