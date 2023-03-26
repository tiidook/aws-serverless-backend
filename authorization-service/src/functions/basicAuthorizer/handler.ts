import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent} from "aws-lambda";

export {AppSyncAuthorizerEvent} from 'aws-lambda'

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  if (event.type !== 'TOKEN'){
      return generatePolicy('test', event.methodArn, 'Deny', false)
  }

  try {
    const authorizationToken = event.authorizationToken

    const encodedCreds = authorizationToken.split(' ')[1]
    const buff = Buffer.from(encodedCreds, 'base64')
    const plainCreds = buff.toString('utf-8').split(':')
    const username = plainCreds[0]
    const password = plainCreds[1]

    console.log(`username: ${username} and password: ${password}`)

    const storedUserPassword = process.env[username]
    const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow'

    return generatePolicy(encodedCreds, event.methodArn, effect)
  } catch (e) {
    return generatePolicy('user', event.methodArn, 'Deny')
  }
};

const generatePolicy = (principalId: string, resource, effect = 'Allow', isTokenExist = true) => {
  const policy = {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
  if (!isTokenExist) {
    policy.policyDocument[`Condition`] = { Null: {
        'aws:Authorization': 'true',
      },
    }
  }
  return policy
}


