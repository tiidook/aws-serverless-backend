import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import/{name}',
        cors: true,
        authorizer: {
          arn: 'arn:aws:lambda:us-east-1:697593023229:function:authorization-service-dev-basicAuthorizer',
          type: 'token',
          resultTtlInSeconds: 0
        }
      },
    },
  ],
};
