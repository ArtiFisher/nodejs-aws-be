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
            cors: true,
            authorizer: {
              name: 'BasicAuthorizer',
              arn: "${cf:authorization-service-${self:provider.stage}.BasicAuthorizerLambdaFunctionQualifiedArn}",
              identitySource: "method.request.header.Authorization",
              resultTtlInSeconds: 0,
            },
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
  resources: {
    Resources: {
      DefaultErrorResponse: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      AccessDeniedResponse: {
          Type: "AWS::ApiGateway::GatewayResponse",
          Properties: {
              ResponseType: "ACCESS_DENIED",
              ResponseParameters: {
                  'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                  'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
              },
              ResponseTemplates: {
                "application/json": `{ "message": "You shall not pass!" }`
              },
              RestApiId: {
                  Ref: 'ApiGatewayRestApi',
              },
              StatusCode: "403"
          }
      },
      UnauthorizedResponse: {
          Type: "AWS::ApiGateway::GatewayResponse",
          Properties: {
              ResponseType: "UNAUTHORIZED",
              ResponseParameters: {
                  'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                  'gatewayresponse.header.Access-Control-Allow-Headers': "'*'"
              },
              ResponseTemplates: {
                "application/json": `{ "message": "Who are you?" }`
              },
              RestApiId: {
                Ref: 'ApiGatewayRestApi',
              },
              StatusCode: "401"
          }
      }
    },
  },
};
