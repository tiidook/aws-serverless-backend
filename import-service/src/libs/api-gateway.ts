import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>, headers = {}) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers
  }
}

export const formatJSONResponseNotFound = () => {
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ error: 'NOT_FOUND' })
  }
}

export const formatInternalError = (errorMessage) => {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: errorMessage || 'INTERNAL_ERROR' })
  }
}

