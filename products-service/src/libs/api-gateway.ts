export const formatJSONResponse = (response: Record<string, unknown>, headers = {}) => {
  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(response)
  }
}

export const formatJSONResponseBadRequest = () => {
  return {
    statusCode: 401,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ error: 'BAD_REQUEST' })
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
