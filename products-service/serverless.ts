import type { AWS } from '@serverless/typescript';
import { createProduct, getProductsById, getProductsList, catalogBatchProcess } from "./src/functions";

const serverlessConfiguration: AWS = {
  service: 'aws-serverless-backend',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        managedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess'],
        statements: [{ Effect: 'Allow', Action: 'sqs:*', Resource: {'Fn::GetAtt': ['SQSCatalogItems', 'Arn']}}]
      }
    }
  },
  resources: {
    Resources: {
      SQSCatalogItems: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      // SQSCatalogItemsSSMParameter: {
      //   Type: 'AWS::SSM::Parameter',
      //   Properties: {
      //     Name: '/parameter/sqs-catalog-items-sqs/queue-arn',
      //     Type: 'String',
      //     Value: {
      //       'Fn::GetAtt': ['SQSCatalogItems', 'Arn']
      //     }
      //   }
      // }
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
