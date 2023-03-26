export const formatJSONResponse = (response: Record<string, unknown>, headers = {}) => {
  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(response)
  }
}

export const formatUnauthorized = () => {
  return {
    statusCode: 403,
    body: {
      error: 'UNAUTHORIZED'
    }
  }
}
